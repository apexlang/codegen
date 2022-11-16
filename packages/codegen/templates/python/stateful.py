from typing import Any, Awaitable, Callable, Dict, Generic, List, Optional, Set, Tuple, Type, TypeVar
from nanobus import Codec, get_session
from serde import serialize, deserialize
from dataclasses import dataclass, field
from base64 import standard_b64decode, b64encode
import pylru


T = TypeVar("T")


class LogicalAddress:
    def __init__(self, type: str, id: str):
        self.type = type
        self.id = id

    def __str__(self):
        return self.type + "/" + self.id


class Item(Generic[T]):
    def __init__(self,
                 data: T,
                 namespace: Optional[str] = None,
                 type: Optional[str] = None,
                 version: Optional[str] = None):
        self.namespace = namespace
        self.type = type
        self.version = version
        self.data = data


@deserialize
@serialize
@dataclass
class RawItem:
    namespace: Optional[str] = field(
        default=None, metadata={'serde_rename': 'namespace'})
    type: Optional[str] = field(default=None, metadata={
                                'serde_rename': 'type'})
    version: Optional[str] = field(default=None, metadata={
                                   'serde_rename': 'version'})
    data: Optional[str] = field(default=None, metadata={
                                'serde_rename': 'data'})
    data_base64: Optional[str] = field(
        default='', metadata={'serde_rename': 'dataBase64'})


@serialize
@dataclass
class Mutation:
    set: Optional[Dict[str, RawItem]] = field(
        default_factory=dict, metadata={'serde_rename': 'set'})
    remove: Optional[List[str]] = field(default_factory=list, metadata={
        'serde_rename': 'remove'})


@serialize
@dataclass
class Response:
    mutation: Mutation = field(default=None, metadata={
                               'serde_rename': 'mutation'})
    result: Any = field(default=None, metadata={'serde_rename': 'result'})


class Store:
    async def get(self, namespace: str, id: str, key: str) -> Awaitable[Optional[RawItem]]:
        pass


class Storage(Store):
    def __init__(self, base_url: str, codec: Codec):
        self.base_url = base_url
        self.codec = codec

    async def get(self, namespace: str, id: str, key: str) -> Awaitable[Optional[RawItem]]:
        async with get_session().get(self.base_url + '/state/' + namespace + '/' + id + '/' + key + '?base64=true') as resp:
            payload = await resp.read()
            item = self.codec.decode(payload, RawItem)
            # Handle bytes/JSON base64 encoding
            if isinstance(item.data, str):
                item.data = standard_b64decode(item.data)
            if item.data_base64 is not None:
                item.data = standard_b64decode(item.data_base64)
                item.data_base64 = None
            return item


class Namespacer:
    def get_namespace() -> str:
        pass


class Typer:
    def get_type() -> str:
        pass


class Versioner:
    def get_version() -> str:
        pass


class State:
    def __init__(self, address: LogicalAddress, store: Store, codec: Codec):
        self.address = address
        self.store = store
        self.codec = codec
        self.state: Dict[str, Item[any]] = {}
        self.changed: Dict[str, Item[any]] = None
        self.removed: Set[str] = None

    def clear(self):
        self.state = {}
        self.changed = None
        self.removed = None

    async def get(self, key: str, type: Type[T]) -> Awaitable[Optional[T]]:
        item = await self.get_item(key, type)
        if item is not None:
            return item.data

        return None

    async def get_item(self, key: str, type: Type[T]) -> Awaitable[Optional[Item[T]]]:
        if self.removed is not None and key in self.removed:
            return None

        item: Item[T] = None
        if self.changed is not None:
            item = self.changed.get(key)
        if item is None:
            item = self.state.get(key)
        if item is not None:
            return item

        raw_item = await self.store.get(
            self.address.type,
            self.address.id,
            key,
        )
        if raw_item is None:
            return None

        data = self.codec.decode(raw_item.data, type)
        item = Item(
            data=data,
            namespace=raw_item.namespace,
            type=raw_item.type,
            version=raw_item.version,
        )
        self.state[key] = item

        return item

    def set(self, key: str, data: any):
        self.set_item(key, self.data_to_item(data))

    def set_item(self, key: str, item: Item[any]):
        if self.changed is None:
            self.changed = {}
        self.changed[key] = item

    def remove(self, key: str):
        if self.changed is None:
            self.changed = {}
        self.changed[key] = Item(None)
        if self.removed is None:
            self.removed = set()
        self.removed.add(key)

    def is_dirty(self) -> bool:
        return self.changed is not None or self.removed is not None

    def reset(self):
        if self.changed is not None:
            for key, value in self.changed.items():
                if value.data is not None:
                    self.state[key] = value
                else:
                    self.remove(key)
        self.changed = None
        self.removed = None

    def to_mutation(self) -> Mutation:
        set: Dict[str, RawItem] = None
        if self.changed is not None:
            set = {}
            for key, item in self.changed.items():
                if item.data is not None:
                    data = self.codec.encode(item.data)
                    encoded = b64encode(data).decode('ascii')
                    set[key] = RawItem(
                        data_base64=encoded,
                        namespace=item.namespace,
                        type=item.type,
                        version=item.version,
                    )

        remove: list[str] = None
        if self.removed is not None:
            for item in self.removed:
                remove.append(item)

        return Mutation(set=set, remove=remove)

    def data_to_item(self, data: T) -> Item[T]:
        namespace: Optional[str] = None
        version: Optional[str] = None
        type = data.__class__.__name__

        if hasattr(data, "get_namespace"):
            namespace = data.get_namespace()
        if hasattr(data, "get_version"):
            version = data.get_version()
        if hasattr(data, "get_type"):
            type = data.get_type()

        return Item(
            namespace=namespace,
            version=version,
            type=type,
            data=data,
        )


class CachedState:
    def __init__(self, revision: int, state: State, actor: any):
        self.revision = revision
        self.state = state
        self.actor = actor


class Cache:
    def get(self, address: LogicalAddress) -> Optional[CachedState]:
        pass

    def set(self, address: LogicalAddress, state: CachedState):
        pass

    def remove(self, address: LogicalAddress):
        pass


class LRUCache(Cache):
    def __init__(self, size: int = 200):
        self.cache = pylru.lrucache(size)

    def get(self, address: LogicalAddress) -> Optional[CachedState]:
        try:
            return self.cache[address.__str__()]
        except KeyError:
            return None

    def set(self, address: LogicalAddress, state: CachedState):
        self.cache[address.__str__()] = state

    def remove(self, address: LogicalAddress):
        del self.cache[address.__str__()]


class Context:
    def __init__(self, address: LogicalAddress, state: State):
        self.self = address
        self.state = state

    async def get(self, key: str, type: Type[T]) -> Awaitable[Optional[T]]:
        return await self.state.get(key, type)

    async def get_item(self, key: str, type: Type[T]) -> Awaitable[Optional[Item[T]]]:
        return await self.state.get_item(key, type)

    def set(self, key: str, data: T):
        self.state.set(key, data)

    def set_item(self, key: str, item: Item[T]):
        self.state.setItem(key, item)

    def remove(self, key: str):
        self.state.remove(key)

    def response(self, result: any) -> Response:
        mutation = self.state.to_mutation()
        return Response(mutation=mutation, result=result)


class Manager:
    def __init__(self, cache: Cache, store: Store, codec: Codec):
        self.cache = cache
        self.store = store
        self.codec = codec

    async def to_context(self, type: str, id: str, actor: any) -> Context:
        address = LogicalAddress(type, id)
        (state, needs_activation) = self.get_state(address, 0, actor)
        context = Context(address, state)
        if needs_activation and hasattr(actor, "activate"):
            await actor.activate(context)
        return context

    def get_state(self, address: LogicalAddress, revision: int, actor: any) -> Tuple[State, bool]:
        if self.cache is not None:
            cached = self.cache.get(address)
            if cached is not None:
                if revision != 0 and revision != cached.revision:
                    cached.state.clear()
                else:
                    cached.state.reset()
                    cached.revision = cached.revision + 1

                return (cached.state, False)

        state = State(address, self.store, self.codec)
        cachedState = CachedState(revision + 1, state, actor)

        if self.cache is not None:
            self.cache.set(address, cachedState)

        return (state, True)

    def deactivate(self, address: LogicalAddress):
        if self.cache:
            self.cache.remove(address)

    def deactivate_handler(self, type: str, actor: any) -> Callable[[str, bytes], Awaitable[bytes]]:
        async def dh(id: str, payload: bytes) -> Awaitable[bytes]:
            sctx = await self.to_context(type, id, actor)
            if hasattr(actor, "deactivate"):
                await actor.deactivate(sctx)
            self.deactivate(sctx.self)
            return b''
        return dh
