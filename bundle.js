// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

var Kind;
(function(Kind) {
    Kind["Namespace"] = "Namespace";
    Kind["Import"] = "Import";
    Kind["Alias"] = "Alias";
    Kind["Interface"] = "Interface";
    Kind["Operation"] = "Operation";
    Kind["Parameter"] = "Parameter";
    Kind["Type"] = "Type";
    Kind["Field"] = "Field";
    Kind["Union"] = "Union";
    Kind["Enum"] = "Enum";
    Kind["EnumValue"] = "EnumValue";
    Kind["Directive"] = "Directive";
    Kind["Require"] = "Require";
    Kind["Annotation"] = "Annotation";
    Kind["Argument"] = "Argument";
    Kind["Void"] = "Void";
    Kind["Primitive"] = "Primitive";
    Kind["List"] = "List";
    Kind["Map"] = "Map";
    Kind["Optional"] = "Optional";
    Kind["Stream"] = "Stream";
})(Kind || (Kind = {}));
class Base {
    kind;
    constructor(kind){
        this.kind = kind;
    }
}
var PrimitiveName;
(function(PrimitiveName) {
    PrimitiveName["ID"] = "ID";
    PrimitiveName["String"] = "string";
    PrimitiveName["U8"] = "u8";
    PrimitiveName["U16"] = "u16";
    PrimitiveName["U32"] = "u32";
    PrimitiveName["U64"] = "u64";
    PrimitiveName["I8"] = "i8";
    PrimitiveName["I16"] = "i16";
    PrimitiveName["I32"] = "i32";
    PrimitiveName["I64"] = "i64";
    PrimitiveName["F32"] = "f32";
    PrimitiveName["F64"] = "f64";
    PrimitiveName["DateTime"] = "datetime";
    PrimitiveName["Bool"] = "bool";
    PrimitiveName["Bytes"] = "bytes";
    PrimitiveName["Any"] = "any";
    PrimitiveName["Value"] = "value";
})(PrimitiveName || (PrimitiveName = {}));
class Void extends Base {
    constructor(){
        super(Kind.Void);
    }
}
const VoidValue = new Void();
class Primitive extends Base {
    name;
    constructor(name){
        super(Kind.Primitive);
        this.name = name;
    }
}
const primitives = {
    ID: new Primitive(PrimitiveName.ID),
    string: new Primitive(PrimitiveName.String),
    u8: new Primitive(PrimitiveName.U8),
    u16: new Primitive(PrimitiveName.U16),
    u32: new Primitive(PrimitiveName.U32),
    u64: new Primitive(PrimitiveName.U64),
    i8: new Primitive(PrimitiveName.I8),
    i16: new Primitive(PrimitiveName.I16),
    i32: new Primitive(PrimitiveName.I32),
    i64: new Primitive(PrimitiveName.I64),
    f32: new Primitive(PrimitiveName.F32),
    f64: new Primitive(PrimitiveName.F64),
    datetime: new Primitive(PrimitiveName.DateTime),
    bool: new Primitive(PrimitiveName.Bool),
    bytes: new Primitive(PrimitiveName.Bytes),
    any: new Primitive(PrimitiveName.Any),
    value: new Primitive(PrimitiveName.Value)
};
class List extends Base {
    type;
    constructor(tr, def){
        super(Kind.List);
        this.type = tr(def.type);
    }
}
class Map1 extends Base {
    keyType;
    valueType;
    constructor(tr, def){
        super(Kind.Map);
        this.keyType = tr(def.keyType);
        this.valueType = tr(def.valueType);
    }
}
class Optional extends Base {
    type;
    constructor(tr, def){
        super(Kind.Optional);
        this.type = tr(def.type);
    }
}
class Stream extends Base {
    type;
    constructor(tr, def){
        super(Kind.Stream);
        this.type = tr(def.type);
    }
}
class Annotated extends Base {
    annotations;
    constructor(kind, annotations){
        super(kind);
        this.annotations = annotations.map((v)=>new Annotation(v));
    }
    annotation(name, callback) {
        return getAnnotation(name, this.annotations, callback);
    }
}
class Namespace extends Annotated {
    node;
    name;
    description;
    directives;
    aliases;
    functions;
    interfaces;
    types;
    enums;
    unions;
    allTypes;
    constructor(tr, node){
        super(Kind.Namespace, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        this.directives = {};
        this.functions = {};
        this.interfaces = {};
        this.types = {};
        this.enums = {};
        this.unions = {};
        this.aliases = {};
        this.allTypes = {};
    }
    accept(context, visitor) {
        context = context.clone({
            namespace: this
        });
        visitor.visitNamespaceBefore(context);
        visitor.visitNamespace(context);
        visitor.visitDirectivesBefore(context);
        for(let name in this.directives){
            const item = this.directives[name];
            item.accept(context.clone({
                directive: item
            }), visitor);
        }
        visitor.visitDirectivesAfter(context);
        visitor.visitAliasesBefore(context);
        for(let name1 in this.aliases){
            const item1 = this.aliases[name1];
            if (!item1.annotation("novisit")) {
                item1.accept(context.clone({
                    alias: item1
                }), visitor);
            }
        }
        visitor.visitAliasesAfter(context);
        visitor.visitAllOperationsBefore(context);
        visitor.visitFunctionsBefore(context);
        for(let name2 in this.functions){
            const item2 = this.functions[name2];
            item2.accept(context.clone({
                operation: item2
            }), visitor);
        }
        visitor.visitFunctionsAfter(context);
        visitor.visitInterfacesBefore(context);
        for(let name3 in this.interfaces){
            const item3 = this.interfaces[name3];
            item3.accept(context.clone({
                interface: item3
            }), visitor);
        }
        visitor.visitInterfacesAfter(context);
        visitor.visitAllOperationsAfter(context);
        visitor.visitTypesBefore(context);
        for(let name4 in this.types){
            const item4 = this.types[name4];
            if (!item4.annotation("novisit")) {
                item4.accept(context.clone({
                    type: item4
                }), visitor);
            }
        }
        visitor.visitTypesAfter(context);
        visitor.visitUnionsBefore(context);
        for(let name5 in this.unions){
            const item5 = this.unions[name5];
            if (!item5.annotation("novisit")) {
                item5.accept(context.clone({
                    union: item5
                }), visitor);
            }
        }
        visitor.visitUnionsAfter(context);
        visitor.visitEnumsBefore(context);
        for(let name6 in this.enums){
            const item6 = this.enums[name6];
            if (!item6.annotation("novisit")) {
                item6.accept(context.clone({
                    enumDef: item6
                }), visitor);
            }
        }
        visitor.visitEnumsAfter(context);
        visitor.visitNamespaceAfter(context);
    }
}
class Alias extends Annotated {
    node;
    name;
    description;
    type;
    constructor(tr, node, register){
        super(Kind.Alias, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        if (register) {
            register(this);
        }
        this.type = tr(node.type);
    }
    accept(context, visitor) {
        visitor.visitAlias(context);
    }
}
class Type extends Annotated {
    node;
    name;
    description;
    fields;
    constructor(tr, node, register){
        super(Kind.Type, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        if (register) {
            register(this);
        }
        this.fields = node.fields.map((v)=>new Field(tr, v));
    }
    accept(context, visitor) {
        visitor.visitTypeBefore(context);
        visitor.visitType(context);
        context = context.clone({
            fields: this.fields
        });
        visitor.visitTypeFieldsBefore(context);
        context.fields.map((field, index)=>{
            field.accept(context.clone({
                field: field,
                fieldIndex: index
            }), visitor);
        });
        visitor.visitTypeFieldsAfter(context);
        visitor.visitTypeAfter(context);
    }
}
class Valued extends Annotated {
    name;
    description;
    type;
    default;
    constructor(tr, kind, node){
        super(kind, node.annotations);
        this.name = node.name.value;
        this.description = node.description?.value;
        this.type = tr(node.type);
    }
}
class Field extends Valued {
    node;
    constructor(tr, node){
        super(tr, Kind.Field, node);
        this.node = node;
    }
    accept(context, visitor) {
        visitor.visitTypeField(context);
    }
}
class Interface extends Annotated {
    node;
    name;
    description;
    operations;
    constructor(tr, node, register){
        super(Kind.Interface, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        if (register) {
            register(this);
        }
        this.operations = node.operations.map((v)=>new Operation(tr, v));
    }
    accept(context, visitor) {
        visitor.visitInterfaceBefore(context);
        visitor.visitInterface(context);
        context = context.clone({
            operations: this.operations
        });
        visitor.visitOperationsBefore(context);
        context.operations.map((operation)=>{
            operation.accept(context.clone({
                operation: operation
            }), visitor);
        });
        visitor.visitOperationsAfter(context);
        visitor.visitInterfaceAfter(context);
    }
}
class Operation extends Annotated {
    node;
    name;
    description;
    parameters;
    type;
    unary;
    constructor(tr, node, register){
        super(Kind.Operation, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        if (register) {
            register(this);
        }
        this.parameters = node.parameters.map((v)=>new Parameter(tr, v));
        this.type = tr(node.type);
        this.unary = node.unary;
    }
    isUnary() {
        return this.unary && this.parameters && this.parameters.length == 1;
    }
    unaryOp() {
        return this.parameters[0];
    }
    accept(context, visitor) {
        if (context.interface) {
            visitor.visitOperationBefore(context);
            visitor.visitOperation(context);
        } else {
            visitor.visitFunctionBefore(context);
            visitor.visitFunction(context);
        }
        context = context.clone({
            parameters: this.parameters
        });
        visitor.visitParametersBefore(context);
        context.parameters.map((parameter, index)=>{
            parameter.accept(context.clone({
                parameter: parameter,
                parameterIndex: index
            }), visitor);
        });
        visitor.visitParametersAfter(context);
        if (context.interface) {
            visitor.visitOperationAfter(context);
        } else {
            visitor.visitFunctionAfter(context);
        }
    }
}
class Parameter extends Valued {
    node;
    constructor(tr, node){
        super(tr, Kind.Parameter, node);
        this.node = node;
    }
    accept(context, visitor) {
        if (context.operation != undefined) {
            visitor.visitParameter(context);
        } else if (context.directive != undefined) {
            visitor.visitDirectiveParameter(context);
        }
    }
}
class Union extends Annotated {
    node;
    name;
    description;
    types;
    constructor(tr, node, register){
        super(Kind.Union, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        if (register) {
            register(this);
        }
        this.types = node.types.map((v)=>tr(v));
    }
    accept(context, visitor) {
        visitor.visitUnion(context);
    }
}
class Enum extends Annotated {
    node;
    name;
    description;
    values;
    constructor(tr, node, register){
        super(Kind.Enum, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        if (register) {
            register(this);
        }
        this.values = node.values.map((v)=>new EnumValue(tr, v));
    }
    accept(context, visitor) {
        visitor.visitEnumBefore(context);
        visitor.visitEnum(context);
        context = context.clone({
            enumValues: this.values
        });
        visitor.visitEnumValuesBefore(context);
        context.enumValues.map((enumValue)=>{
            enumValue.accept(context.clone({
                enumValue: enumValue
            }), visitor);
        });
        visitor.visitEnumValuesAfter(context);
        visitor.visitEnumAfter(context);
    }
}
class EnumValue extends Annotated {
    node;
    name;
    description;
    index;
    display;
    constructor(tr, node){
        super(Kind.EnumValue, node.annotations);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        this.index = node.index.value;
        this.display = node.display?.value;
    }
    accept(context, visitor) {
        visitor.visitEnumValue(context);
    }
}
class Directive extends Base {
    node;
    name;
    description;
    parameters;
    locations;
    requires;
    constructor(tr, node, register){
        super(Kind.Directive);
        this.node = node;
        this.name = node.name.value;
        this.description = node.description?.value;
        if (register) {
            register(this);
        }
        this.parameters = node.parameters.map((v)=>new Parameter(tr, v));
        this.locations = node.locations.map((v)=>v.value);
        this.requires = node.requires.map((v)=>new Require(tr, v));
    }
    hasLocation(location) {
        for (let l of this.locations){
            if (l == location) {
                return true;
            }
        }
        return false;
    }
    accept(context, visitor) {
        visitor.visitDirectiveBefore(context);
        visitor.visitDirective(context);
        context = context.clone({
            parameters: this.parameters
        });
        visitor.visitDirectiveParametersBefore(context);
        context.parameters.map((parameter, index)=>{
            parameter.accept(context.clone({
                parameter: parameter,
                parameterIndex: index
            }), visitor);
        });
        visitor.visitDirectiveParametersAfter(context);
        visitor.visitDirectiveAfter(context);
    }
}
class Require extends Base {
    node;
    directive;
    locations;
    constructor(tr, node){
        super(Kind.Require);
        this.node = node;
        this.directive = node.directive.value;
        this.locations = node.locations.map((v)=>v.value);
    }
    hasLocation(location) {
        for (let l of this.locations){
            if (l == location) {
                return true;
            }
        }
        return false;
    }
}
class Annotation extends Base {
    node;
    name;
    arguments;
    constructor(node){
        super(Kind.Annotation);
        this.node = node;
        this.name = node.name.value;
        this.arguments = node.arguments.map((v)=>new Argument(v));
    }
    convert() {
        let obj = {};
        this.arguments.map((arg)=>{
            obj[arg.name] = arg.value.getValue();
        });
        return obj;
    }
    accept(context, visitor) {
        visitor.visitAnnotation(context);
    }
}
class Argument extends Base {
    node;
    name;
    value;
    constructor(node){
        super(Kind.Argument);
        this.node = node;
        this.name = node.name.value;
        this.value = node.value;
    }
}
function getAnnotation(name, annotations, callback) {
    if (annotations == undefined) {
        return undefined;
    }
    for (let a of annotations){
        if (a.name === name) {
            if (callback != undefined) {
                callback(a);
            }
            return a;
        }
    }
    return undefined;
}
var Kind1;
(function(Kind) {
    Kind["Document"] = "Document";
    Kind["Name"] = "Name";
    Kind["Annotation"] = "Annotation";
    Kind["Argument"] = "Argument";
    Kind["DirectiveRequire"] = "DirectiveRequire";
    Kind["ImportName"] = "ImportName";
    Kind["IntValue"] = "IntValue";
    Kind["FloatValue"] = "FloatValue";
    Kind["StringValue"] = "StringValue";
    Kind["BooleanValue"] = "BooleanValue";
    Kind["EnumValue"] = "EnumValue";
    Kind["ListValue"] = "ListValue";
    Kind["MapValue"] = "MapValue";
    Kind["ObjectValue"] = "ObjectValue";
    Kind["ObjectField"] = "ObjectField";
    Kind["Named"] = "Named";
    Kind["ListType"] = "ListType";
    Kind["MapType"] = "MapType";
    Kind["Optional"] = "Optional";
    Kind["Stream"] = "Stream";
    Kind["NamespaceDefinition"] = "NamespaceDefinition";
    Kind["ImportDefinition"] = "ImportDefinition";
    Kind["AliasDefinition"] = "AliasDefinition";
    Kind["InterfaceDefinition"] = "InterfaceDefinition";
    Kind["OperationDefinition"] = "OperationDefinition";
    Kind["ParameterDefinition"] = "ParameterDefinition";
    Kind["TypeDefinition"] = "TypeDefinition";
    Kind["FieldDefinition"] = "FieldDefinition";
    Kind["UnionDefinition"] = "UnionDefinition";
    Kind["EnumDefinition"] = "EnumDefinition";
    Kind["EnumValueDefinition"] = "EnumValueDefinition";
    Kind["DirectiveDefinition"] = "DirectiveDefinition";
})(Kind1 || (Kind1 = {}));
class AbstractNode {
    kind;
    loc;
    imported = false;
    constructor(kind, loc){
        this.kind = kind;
        this.loc = loc;
    }
    getKind() {
        return this.kind;
    }
    getLoc() {
        return this.loc;
    }
    isKind(kind) {
        return this.kind === kind;
    }
    accept(_context, _visitor) {}
}
class Name extends AbstractNode {
    value;
    constructor(doc, value){
        super(Kind1.Name, doc);
        this.value = value || "";
    }
}
class NamespaceDefinition extends AbstractNode {
    name;
    description;
    annotations;
    constructor(loc, name, desc, annotations){
        super(Kind1.NamespaceDefinition, loc);
        this.description = desc;
        this.name = name;
        this.annotations = annotations || [];
    }
    annotation(name, callback) {
        return getAnnotation1(name, this.annotations, callback);
    }
    accept(context, visitor) {
        visitor.visitNamespace(context);
        visitAnnotations(context, visitor, this.annotations);
    }
}
class TypeDefinition extends AbstractNode {
    name;
    description;
    interfaces;
    annotations;
    fields;
    constructor(loc, name, desc, interfaces, annotations, fields){
        super(Kind1.TypeDefinition, loc);
        this.name = name;
        this.description = desc;
        this.interfaces = interfaces;
        this.annotations = annotations;
        this.fields = fields;
    }
    annotation(name, callback) {
        return getAnnotation1(name, this.annotations, callback);
    }
    accept(context, visitor) {
        visitor.visitTypeBefore(context);
        visitor.visitType(context);
        context = context.clone({
            fields: context.type.fields
        });
        visitor.visitTypeFieldsBefore(context);
        context.fields.map((field, index)=>{
            field.accept(context.clone({
                field: field,
                fieldIndex: index
            }), visitor);
        });
        visitor.visitTypeFieldsAfter(context);
        visitAnnotations(context, visitor, this.annotations);
        visitor.visitTypeAfter(context);
    }
}
class ValuedDefinition extends AbstractNode {
    name;
    description;
    type;
    default;
    annotations;
    constructor(kind, loc, name, desc, type, defaultVal, annotations){
        super(kind, loc);
        this.name = name;
        this.description = desc;
        this.type = type;
        this.default = defaultVal;
        this.annotations = annotations;
    }
    annotation(name, callback) {
        return getAnnotation1(name, this.annotations, callback);
    }
}
class FieldDefinition extends ValuedDefinition {
    constructor(loc, name, desc, type, defaultVal, annotations){
        super(Kind1.FieldDefinition, loc, name, desc, type, defaultVal, annotations);
    }
    accept(context, visitor) {
        visitor.visitTypeField(context);
        visitAnnotations(context, visitor, this.annotations);
    }
}
function visitAnnotations(context, visitor, annotations) {
    if (annotations == undefined) {
        return;
    }
    visitor.visitAnnotationsBefore(context);
    annotations.map((annotation)=>{
        const c = context.clone({
            annotation: annotation
        });
        visitor.visitAnnotationBefore(c);
        annotation.accept(c, visitor);
        visitor.visitAnnotationAfter(c);
    });
    visitor.visitAnnotationsAfter(context);
}
function getAnnotation1(name, annotations, callback) {
    if (annotations == undefined) {
        return undefined;
    }
    for (let a of annotations){
        if (a.name.value === name) {
            if (callback != undefined) {
                callback(a);
            }
            return a;
        }
    }
    return undefined;
}
const CONSTRUCTOR = "constructor";
const REACT_EXCLUDE_METHODS = {
    render: true,
    setState: true,
    forceUpdate: true,
    UNSAFE_componentWillUpdate: true,
    UNSAFE_componentWillMount: true,
    getChildContext: true,
    componentWillMount: true,
    componentDidMount: true,
    componentWillReceiveProps: true,
    shouldComponentUpdate: true,
    componentWillUpdate: true,
    componentDidUpdate: true,
    componentWillUnmount: true,
    componentDidCatch: true,
    getSnapshotBeforeUpdate: true
};
function autobind(instance, proto) {
    if (!proto) {
        try {
            proto = Object.getPrototypeOf(instance);
        } catch (error) {
            throw new Error(`Cannot get prototype of ${instance}`);
        }
    }
    const properties = Object.getOwnPropertyNames(proto);
    properties.forEach((name)=>bind(name, instance, proto));
}
function bind(name, instance, proto) {
    if (!isPrototype(proto)) {
        return;
    }
    if (!isPrototype(instance)) {
        return;
    }
    if (name === CONSTRUCTOR) {
        return;
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
    if (!descriptor) {
        return;
    }
    if (descriptor.get || descriptor.set) {
        Object.defineProperty(proto, name, {
            ...descriptor,
            get: descriptor.get ? descriptor.get.bind(instance) : void 0,
            set: descriptor.set ? descriptor.set.bind(instance) : void 0
        });
        return;
    }
    if (isFunction(descriptor.value) && !isExcluded(name)) {
        instance[name] = proto[name].bind(instance);
    }
}
function isExcluded(key) {
    return REACT_EXCLUDE_METHODS[key] === true;
}
function isFunction(item) {
    return typeof item === "function";
}
function isPrototype(value) {
    return typeof value === "object";
}
class AbstractVisitor {
    callbacks = new Map();
    setCallback(phase, purpose, callback) {
        var purposes = this.callbacks.get(phase);
        if (purposes == undefined) {
            purposes = new Map();
            this.callbacks.set(phase, purposes);
        }
        purposes.set(purpose, callback);
    }
    triggerCallbacks(context, phase) {
        var purposes = this.callbacks.get(phase);
        if (purposes == undefined) {
            return;
        }
        purposes.forEach((callback)=>{
            callback(context);
        });
    }
    visitDocumentBefore(context) {
        this.triggerDocumentBefore(context);
    }
    triggerDocumentBefore(context) {
        this.triggerCallbacks(context, "DocumentBefore");
    }
    visitNamespace(context) {
        this.triggerNamespace(context);
    }
    triggerNamespace(context) {
        this.triggerCallbacks(context, "Namespace");
    }
    visitImportsBefore(context) {
        this.triggerImportsBefore(context);
    }
    triggerImportsBefore(context) {
        this.triggerCallbacks(context, "ImportsBefore");
    }
    visitImport(context) {
        this.triggerImport(context);
    }
    triggerImport(context) {
        this.triggerCallbacks(context, "Import");
    }
    visitImportsAfter(context) {
        this.triggerImportsAfter(context);
    }
    triggerImportsAfter(context) {
        this.triggerCallbacks(context, "ImportsAfter");
    }
    visitDirectivesBefore(context) {
        this.triggerDirectivesBefore(context);
    }
    triggerDirectivesBefore(context) {
        this.triggerCallbacks(context, "DirectivesBefore");
    }
    visitDirectiveBefore(context) {
        this.triggerDirectiveBefore(context);
    }
    triggerDirectiveBefore(context) {
        this.triggerCallbacks(context, "DirectiveBefore");
    }
    visitDirective(context) {
        this.triggerDirective(context);
    }
    triggerDirective(context) {
        this.triggerCallbacks(context, "Directive");
    }
    visitDirectiveParametersBefore(context) {
        this.triggerDirectiveParametersBefore(context);
    }
    triggerDirectiveParametersBefore(context) {
        this.triggerCallbacks(context, "DirectiveParametersBefore");
    }
    visitDirectiveParameter(context) {
        this.triggerDirectiveParameter(context);
    }
    triggerDirectiveParameter(context) {
        this.triggerCallbacks(context, "DirectiveParameter");
    }
    visitDirectiveParametersAfter(context) {
        this.triggerDirectiveParametersAfter(context);
    }
    triggerDirectiveParametersAfter(context) {
        this.triggerCallbacks(context, "DirectiveParametersAfter");
    }
    visitDirectiveAfter(context) {
        this.triggerDirectiveBefore(context);
    }
    triggerDirectiveAfter(context) {
        this.triggerCallbacks(context, "DirectiveAfter");
    }
    visitDirectivesAfter(context) {
        this.triggerDirectivesAfter(context);
    }
    triggerDirectivesAfter(context) {
        this.triggerCallbacks(context, "DirectivesAfter");
    }
    visitAliasesBefore(context) {
        this.triggerAliasesBefore(context);
    }
    triggerAliasesBefore(context) {
        this.triggerCallbacks(context, "AliasesBefore");
    }
    visitAliasBefore(context) {
        this.triggerAliasBefore(context);
    }
    triggerAliasBefore(context) {
        this.triggerCallbacks(context, "AliasBefore");
    }
    visitAlias(context) {
        this.triggerAlias(context);
    }
    triggerAlias(context) {
        this.triggerCallbacks(context, "Alias");
    }
    visitAliasAfter(context) {
        this.triggerAliasBefore(context);
    }
    triggerAliasAfter(context) {
        this.triggerCallbacks(context, "AliasAfter");
    }
    visitAliasesAfter(context) {
        this.triggerAliasesAfter(context);
    }
    triggerAliasesAfter(context) {
        this.triggerCallbacks(context, "AliasesAfter");
    }
    visitAllOperationsBefore(context) {
        this.triggerAllOperationsBefore(context);
    }
    triggerAllOperationsBefore(context) {
        this.triggerCallbacks(context, "AllOperationsBefore");
    }
    visitFunctionsBefore(context) {
        this.triggerFunctionsBefore(context);
    }
    triggerFunctionsBefore(context) {
        this.triggerCallbacks(context, "FunctionsBefore");
    }
    visitFunctionBefore(context) {
        this.triggerFunctionBefore(context);
    }
    triggerFunctionBefore(context) {
        this.triggerCallbacks(context, "FunctionBefore");
    }
    visitFunction(context) {
        this.triggerFunction(context);
    }
    triggerFunction(context) {
        this.triggerCallbacks(context, "Function");
    }
    visitFunctionAfter(context) {
        this.triggerFunctionAfter(context);
    }
    triggerFunctionAfter(context) {
        this.triggerCallbacks(context, "FunctionAfter");
    }
    visitFunctionsAfter(context) {
        this.triggerFunctionsAfter(context);
    }
    triggerFunctionsAfter(context) {
        this.triggerCallbacks(context, "FunctionsAfter");
    }
    visitInterfacesBefore(context) {
        this.triggerInterfacesBefore(context);
    }
    triggerInterfacesBefore(context) {
        this.triggerCallbacks(context, "InterfacesBefore");
    }
    visitInterfaceBefore(context) {
        this.triggerInterfaceBefore(context);
    }
    triggerInterfaceBefore(context) {
        this.triggerCallbacks(context, "InterfaceBefore");
    }
    visitInterface(context) {
        this.triggerInterface(context);
    }
    triggerInterface(context) {
        this.triggerCallbacks(context, "Interface");
    }
    visitOperationsBefore(context) {
        this.triggerOperationsBefore(context);
    }
    triggerOperationsBefore(context) {
        this.triggerCallbacks(context, "OperationsBefore");
    }
    visitOperationBefore(context) {
        this.triggerOperationBefore(context);
    }
    triggerOperationBefore(context) {
        this.triggerCallbacks(context, "OperationBefore");
    }
    visitOperation(context) {
        this.triggerOperation(context);
    }
    triggerOperation(context) {
        this.triggerCallbacks(context, "Operation");
    }
    visitParametersBefore(context) {
        this.triggerParametersBefore(context);
    }
    triggerParametersBefore(context) {
        this.triggerCallbacks(context, "ParametersBefore");
    }
    visitParameter(context) {
        this.triggerParameter(context);
    }
    triggerParameter(context) {
        this.triggerCallbacks(context, "Parameter");
    }
    visitParametersAfter(context) {
        this.triggerParametersAfter(context);
    }
    triggerParametersAfter(context) {
        this.triggerCallbacks(context, "ParametersAfter");
    }
    visitOperationAfter(context) {
        this.triggerOperationAfter(context);
    }
    triggerOperationAfter(context) {
        this.triggerCallbacks(context, "OperationAfter");
    }
    visitOperationsAfter(context) {
        this.triggerOperationsAfter(context);
    }
    triggerOperationsAfter(context) {
        this.triggerCallbacks(context, "OperationsAfter");
    }
    visitInterfaceAfter(context) {
        this.triggerInterfaceAfter(context);
    }
    triggerInterfaceAfter(context) {
        this.triggerCallbacks(context, "InterfaceAfter");
    }
    visitInterfacesAfter(context) {
        this.triggerInterfacesAfter(context);
    }
    triggerInterfacesAfter(context) {
        this.triggerCallbacks(context, "InterfacesAfter");
    }
    visitAllOperationsAfter(context) {
        this.triggerAllOperationsAfter(context);
    }
    triggerAllOperationsAfter(context) {
        this.triggerCallbacks(context, "AllOperationsAfter");
    }
    visitTypesBefore(context) {
        this.triggerTypesBefore(context);
    }
    triggerTypesBefore(context) {
        this.triggerCallbacks(context, "TypesBefore");
    }
    visitTypeBefore(context) {
        this.triggerTypeBefore(context);
    }
    triggerTypeBefore(context) {
        this.triggerCallbacks(context, "TypeBefore");
    }
    visitType(context) {
        this.triggerType(context);
    }
    triggerType(context) {
        this.triggerCallbacks(context, "Type");
    }
    visitTypeFieldsBefore(context) {
        this.triggerTypeFieldsBefore(context);
    }
    triggerTypeFieldsBefore(context) {
        this.triggerCallbacks(context, "TypeFieldsBefore");
    }
    visitTypeField(context) {
        this.triggerTypeField(context);
    }
    triggerTypeField(context) {
        this.triggerCallbacks(context, "TypeField");
    }
    visitTypeFieldsAfter(context) {
        this.triggerTypeFieldsAfter(context);
    }
    triggerTypeFieldsAfter(context) {
        this.triggerCallbacks(context, "TypeFieldsAfter");
    }
    visitTypeAfter(context) {
        this.triggerTypeAfter(context);
    }
    triggerTypeAfter(context) {
        this.triggerCallbacks(context, "TypeAfter");
    }
    visitTypesAfter(context) {
        this.triggerTypesAfter(context);
    }
    triggerTypesAfter(context) {
        this.triggerCallbacks(context, "TypesAfter");
    }
    visitEnumsBefore(context) {
        this.triggerEnumsBefore(context);
    }
    triggerEnumsBefore(context) {
        this.triggerCallbacks(context, "EnumsBefore");
    }
    visitEnumBefore(context) {
        this.triggerEnumsBefore(context);
    }
    triggerEnumBefore(context) {
        this.triggerCallbacks(context, "EnumBefore");
    }
    visitEnum(context) {
        this.triggerEnum(context);
    }
    triggerEnum(context) {
        this.triggerCallbacks(context, "Enum");
    }
    visitEnumValuesBefore(context) {
        this.triggerEnumValuesBefore(context);
    }
    triggerEnumValuesBefore(context) {
        this.triggerCallbacks(context, "EnumValuesBefore");
    }
    visitEnumValue(context) {
        this.triggerEnumValue(context);
    }
    triggerEnumValue(context) {
        this.triggerCallbacks(context, "EnumValue");
    }
    visitEnumValuesAfter(context) {
        this.triggerEnumValuesAfter(context);
    }
    triggerEnumValuesAfter(context) {
        this.triggerCallbacks(context, "EnumValuesAfter");
    }
    visitEnumAfter(context) {
        this.triggerEnumsAfter(context);
    }
    triggerEnumAfter(context) {
        this.triggerCallbacks(context, "EnumAfter");
    }
    visitEnumsAfter(context) {
        this.triggerEnumsAfter(context);
    }
    triggerEnumsAfter(context) {
        this.triggerCallbacks(context, "EnumsAfter");
    }
    visitUnionsBefore(context) {
        this.triggerUnionsBefore(context);
    }
    triggerUnionsBefore(context) {
        this.triggerCallbacks(context, "UnionsBefore");
    }
    visitUnion(context) {
        this.triggerCallbacks(context, "Union");
    }
    triggerUnion(context) {
        this.triggerCallbacks(context, "Union");
    }
    visitUnionsAfter(context) {
        this.triggerUnionsAfter(context);
    }
    triggerUnionsAfter(context) {
        this.triggerCallbacks(context, "UnionsAfter");
    }
    visitAnnotationsBefore(context) {
        this.triggerAnnotationsBefore(context);
    }
    triggerAnnotationsBefore(context) {
        this.triggerCallbacks(context, "AnnotationsBefore");
    }
    visitAnnotationBefore(context) {
        this.triggerAnnotationBefore(context);
    }
    triggerAnnotationBefore(context) {
        this.triggerCallbacks(context, "AnnotationBefore");
    }
    visitAnnotation(context) {
        this.triggerAnnotation(context);
    }
    triggerAnnotation(context) {
        this.triggerCallbacks(context, "Annotation");
    }
    visitAnnotationArgumentsBefore(context) {
        this.triggerAnnotationArgumentsBefore(context);
    }
    triggerAnnotationArgumentsBefore(context) {
        this.triggerCallbacks(context, "AnnotationArgumentsBefore");
    }
    visitAnnotationArgument(context) {
        this.triggerAnnotationArgument(context);
    }
    triggerAnnotationArgument(context) {
        this.triggerCallbacks(context, "AnnotationArgument");
    }
    visitAnnotationArgumentsAfter(context) {
        this.triggerAnnotationArgumentsAfter(context);
    }
    triggerAnnotationArgumentsAfter(context) {
        this.triggerCallbacks(context, "AnnotationArgumentsAfter");
    }
    visitAnnotationAfter(context) {
        this.triggerAnnotationAfter(context);
    }
    triggerAnnotationAfter(context) {
        this.triggerCallbacks(context, "AnnotationAfter");
    }
    visitAnnotationsAfter(context) {
        this.triggerAnnotationsAfter(context);
    }
    triggerAnnotationsAfter(context) {
        this.triggerCallbacks(context, "AnnotationsAfter");
    }
    visitDocumentAfter(context) {
        this.triggerDocumentAfter(context);
    }
    triggerDocumentAfter(context) {
        this.triggerCallbacks(context, "DocumentAfter");
    }
}
class Named extends AbstractNode {
    name;
    constructor(loc, name){
        super(Kind1.Named, loc);
        this.name = name;
    }
    string() {
        return this.getKind();
    }
}
class ListType extends AbstractNode {
    type;
    constructor(loc, type){
        super(Kind1.ListType, loc);
        this.type = type || null;
    }
    string() {
        return this.getKind();
    }
}
class MapType extends AbstractNode {
    keyType;
    valueType;
    constructor(loc, keyType, valueType){
        super(Kind1.MapType, loc);
        this.keyType = keyType || null;
        this.valueType = valueType || null;
    }
    string() {
        return this.getKind();
    }
}
class Optional1 extends AbstractNode {
    type;
    constructor(loc, type){
        super(Kind1.Optional, loc);
        this.type = type || null;
    }
    string() {
        return this.getKind();
    }
}
class Stream1 extends AbstractNode {
    type;
    constructor(loc, type){
        super(Kind1.Stream, loc);
        this.type = type || null;
    }
    string() {
        return this.getKind();
    }
}
class StringValue extends AbstractNode {
    value;
    constructor(loc, value){
        super(Kind1.StringValue, loc);
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
class ErrorHolder {
    errors;
    constructor(){
        this.errors = new Array();
    }
    reportError(error) {
        this.errors.push(error);
    }
}
function dummyValue(fieldName) {
    return undefined;
}
class Context {
    config;
    document;
    namespaces;
    namespace;
    namespacePos = dummyValue("namespacePos");
    directive = dummyValue("directive");
    alias = dummyValue("alias");
    interface = dummyValue("interface");
    type = dummyValue("type");
    operations = dummyValue("operations");
    operation = dummyValue("operation");
    parameters = dummyValue("parameters");
    parameter = dummyValue("parameter");
    parameterIndex = dummyValue("parameterIndex");
    fields = dummyValue("fields");
    field = dummyValue("fields");
    fieldIndex = dummyValue("fieldIndex");
    enum = dummyValue("enum");
    enumValues = dummyValue("enumValues");
    enumValue = dummyValue("enumValue");
    union = dummyValue("union");
    annotations = dummyValue("annotations");
    annotation = dummyValue("annotation");
    errors;
    typeMap;
    constructor(config, document, other){
        this.config = config || {};
        this.namespace = new Namespace(this.getType.bind(this), new NamespaceDefinition(undefined, new Name(undefined, "undefined"), undefined));
        if (other != undefined) {
            this.document = other.document;
            this.namespace = other.namespace;
            this.namespaces = other.namespaces;
            this.errors = other.errors;
            this.typeMap = other.typeMap;
        } else {
            this.namespaces = [];
            this.errors = new ErrorHolder();
            this.typeMap = {};
        }
        if (this.document == undefined && document != undefined) {
            this.document = document;
            this.parseDocument();
        } else if (!other) {
            throw new Error("document or context is required");
        }
        autobind(this);
    }
    clone({ namespace , directive , alias , interface: iface , type , operations , operation , parameters , parameter , parameterIndex , fields , field , fieldIndex , enumDef , enumValues , enumValue , union , annotation  }) {
        var context = new Context(this.config, undefined, this);
        context.namespace = namespace || this.namespace;
        context.namespacePos = this.namespacePos;
        context.directive = directive || this.directive;
        context.alias = alias || this.alias;
        context.interface = iface || this.interface;
        context.type = type || this.type;
        context.operations = operations || this.operations;
        context.operation = operation || this.operation;
        context.parameters = parameters || this.parameters;
        context.parameter = parameter || this.parameter;
        context.parameterIndex = parameterIndex || this.parameterIndex;
        context.fields = fields || this.fields;
        context.field = field || this.field;
        context.fieldIndex = fieldIndex || this.fieldIndex;
        context.enum = enumDef || this.enum;
        context.enumValues = enumValues || this.enumValues;
        context.enumValue = enumValue || this.enumValue;
        context.union = union || this.union;
        context.annotation = annotation || this.annotation;
        return context;
    }
    parseDocument() {
        this.document.definitions.forEach((value, index)=>{
            switch(value.getKind()){
                case Kind1.NamespaceDefinition:
                    const namespace = new Namespace(this.getType.bind(this), value);
                    this.namespaces.push(namespace);
                    this.namespace = namespace;
                    this.namespacePos = index;
                    break;
                case Kind1.AliasDefinition:
                    const aliasDef = value;
                    this.typeMap[aliasDef.name.value] = aliasDef;
                    break;
                case Kind1.TypeDefinition:
                    const typeDef = value;
                    this.typeMap[typeDef.name.value] = typeDef;
                    break;
                case Kind1.EnumDefinition:
                    const enumDef = value;
                    this.typeMap[enumDef.name.value] = enumDef;
                    break;
                case Kind1.UnionDefinition:
                    const unionDef = value;
                    this.typeMap[unionDef.name.value] = unionDef;
                    break;
            }
        });
        if (!this.namespace || this.namespace.name == "undefined") {
            throw new Error("namespace not found");
        }
        this.document.definitions.forEach((value)=>{
            switch(value.getKind()){
                case Kind1.AliasDefinition:
                    const aliasDef = value;
                    if (!this.namespace.allTypes[aliasDef.name.value]) {
                        new Alias(this.getType.bind(this), aliasDef, (a)=>{
                            this.namespace.aliases[a.name] = a;
                            this.namespace.allTypes[a.name] = a;
                        });
                    }
                    break;
                case Kind1.TypeDefinition:
                    const typeDef = value;
                    if (!this.namespace.allTypes[typeDef.name.value]) {
                        new Type(this.getType.bind(this), typeDef, (t)=>{
                            this.namespace.types[t.name] = t;
                            this.namespace.allTypes[t.name] = t;
                        });
                    }
                    break;
                case Kind1.EnumDefinition:
                    const enumDef = value;
                    if (!this.namespace.allTypes[enumDef.name.value]) {
                        new Enum(this.getType.bind(this), enumDef, (e)=>{
                            this.namespace.enums[e.name] = e;
                            this.namespace.allTypes[e.name] = e;
                        });
                    }
                    break;
                case Kind1.UnionDefinition:
                    const unionDef = value;
                    if (!this.namespace.allTypes[unionDef.name.value]) {
                        new Union(this.getType.bind(this), unionDef, (u)=>{
                            this.namespace.unions[u.name] = u;
                            this.namespace.allTypes[u.name] = u;
                        });
                    }
                    break;
            }
        });
        this.document.definitions.forEach((value)=>{
            switch(value.getKind()){
                case Kind1.DirectiveDefinition:
                    new Directive(this.getType.bind(this), value, (d)=>{
                        this.namespace.directives[d.name] = d;
                    });
                    break;
                case Kind1.OperationDefinition:
                    new Operation(this.getType.bind(this), value, (r)=>{
                        this.namespace.functions[r.name] = r;
                    });
                    break;
                case Kind1.InterfaceDefinition:
                    new Interface(this.getType.bind(this), value, (r)=>{
                        this.namespace.interfaces[r.name] = r;
                    });
                    break;
            }
        });
        this.document.definitions.forEach((value)=>{
            switch(value.getKind()){
                case Kind1.AliasDefinition:
                    const aliasDef = value;
                    const a = this.namespace.aliases[aliasDef.name.value];
                    delete this.namespace.aliases[a.name];
                    delete this.namespace.allTypes[a.name];
                    this.namespace.aliases[a.name] = a;
                    this.namespace.allTypes[a.name] = a;
                    break;
                case Kind1.TypeDefinition:
                    const typeDef = value;
                    const t = this.namespace.types[typeDef.name.value];
                    delete this.namespace.types[t.name];
                    delete this.namespace.allTypes[t.name];
                    this.namespace.types[t.name] = t;
                    this.namespace.allTypes[t.name] = t;
                    break;
                case Kind1.EnumDefinition:
                    const enumDef = value;
                    const e = this.namespace.enums[enumDef.name.value];
                    delete this.namespace.enums[e.name];
                    delete this.namespace.allTypes[e.name];
                    this.namespace.enums[e.name] = e;
                    this.namespace.allTypes[e.name] = e;
                    break;
                case Kind1.UnionDefinition:
                    const unionDef = value;
                    const u = this.namespace.unions[unionDef.name.value];
                    delete this.namespace.unions[u.name];
                    delete this.namespace.allTypes[u.name];
                    this.namespace.unions[u.name] = u;
                    this.namespace.allTypes[u.name] = u;
                    break;
            }
        });
    }
    reportError(error) {
        this.errors.reportError(error);
    }
    getErrors() {
        return this.errors.errors;
    }
    getType(t) {
        switch(t.getKind()){
            case Kind1.Named:
                const name = t.name.value;
                if (name === "void") {
                    return VoidValue;
                }
                let namedType = this.namespace.allTypes[name];
                if (namedType != undefined) {
                    return namedType;
                }
                namedType = primitives[name];
                if (namedType != undefined) {
                    return namedType;
                }
                const anyTypeDef = this.typeMap[name];
                if (!anyTypeDef) {
                    throw new Error(`Unknown type ${name}`);
                }
                switch(anyTypeDef.getKind()){
                    case Kind1.AliasDefinition:
                        return new Alias(this.getType.bind(this), anyTypeDef, (a)=>{
                            this.namespace.aliases[a.name] = a;
                            this.namespace.allTypes[a.name] = a;
                        });
                    case Kind1.TypeDefinition:
                        return new Type(this.getType.bind(this), anyTypeDef, (t)=>{
                            this.namespace.types[t.name] = t;
                            this.namespace.allTypes[t.name] = t;
                        });
                    case Kind1.UnionDefinition:
                        return new Union(this.getType.bind(this), anyTypeDef, (u)=>{
                            this.namespace.unions[u.name] = u;
                            this.namespace.allTypes[u.name] = u;
                        });
                    case Kind1.EnumDefinition:
                        return new Enum(this.getType.bind(this), anyTypeDef, (e)=>{
                            this.namespace.enums[e.name] = e;
                            this.namespace.allTypes[e.name] = e;
                        });
                }
                break;
            case Kind1.Optional:
                const optional = t;
                return new Optional(this.getType.bind(this), optional);
            case Kind1.ListType:
                const list = t;
                return new List(this.getType.bind(this), list);
            case Kind1.MapType:
                const map = t;
                return new Map1(this.getType.bind(this), map);
            case Kind1.Stream:
                const stream = t;
                return new Stream(this.getType.bind(this), stream);
        }
        throw new Error("could not resolve type: " + t);
    }
    accept(context, visitor) {
        visitor.visitContextBefore(context);
        context.namespaces.map((namespace)=>{
            namespace.accept(context.clone({
                namespace: namespace
            }), visitor);
        });
        visitor.visitContextAfter(context);
    }
}
class AbstractVisitor1 {
    callbacks = {};
    setCallback(phase, purpose, callback) {
        var purposes = this.callbacks[phase];
        if (purposes == undefined) {
            purposes = {};
            this.callbacks[phase] = purposes;
        }
        purposes[purpose] = callback;
    }
    triggerCallbacks(context, phase) {
        var purposes = this.callbacks[phase];
        if (purposes == undefined) {
            return;
        }
        for (let name of Object.keys(purposes)){
            const callback = purposes[name];
            callback(context);
        }
    }
    visitContextBefore(context) {
        this.triggerContextBefore(context);
    }
    triggerContextBefore(context) {
        this.triggerCallbacks(context, "ContextBefore");
    }
    visitContextAfter(context) {
        this.triggerContextAfter(context);
    }
    triggerContextAfter(context) {
        this.triggerCallbacks(context, "ContextAfter");
    }
    visitNamespaceBefore(context) {
        this.triggerNamespaceBefore(context);
    }
    triggerNamespaceBefore(context) {
        this.triggerCallbacks(context, "NamespaceBefore");
    }
    visitNamespace(context) {
        this.triggerNamespace(context);
    }
    triggerNamespace(context) {
        this.triggerCallbacks(context, "Namespace");
    }
    visitNamespaceAfter(context) {
        this.triggerNamespaceAfter(context);
    }
    triggerNamespaceAfter(context) {
        this.triggerCallbacks(context, "NamespaceAfter");
    }
    visitImportsBefore(context) {
        this.triggerImportsBefore(context);
    }
    triggerImportsBefore(context) {
        this.triggerCallbacks(context, "ImportsBefore");
    }
    visitImport(context) {
        this.triggerImport(context);
    }
    triggerImport(context) {
        this.triggerCallbacks(context, "Import");
    }
    visitImportsAfter(context) {
        this.triggerImportsAfter(context);
    }
    triggerImportsAfter(context) {
        this.triggerCallbacks(context, "ImportsAfter");
    }
    visitDirectivesBefore(context) {
        this.triggerDirectivesBefore(context);
    }
    triggerDirectivesBefore(context) {
        this.triggerCallbacks(context, "DirectivesBefore");
    }
    visitDirectiveBefore(context) {
        this.triggerDirectiveBefore(context);
    }
    triggerDirectiveBefore(context) {
        this.triggerCallbacks(context, "DirectiveBefore");
    }
    visitDirective(context) {
        this.triggerDirective(context);
    }
    triggerDirective(context) {
        this.triggerCallbacks(context, "Directive");
    }
    visitDirectiveParametersBefore(context) {
        this.triggerDirectiveParametersBefore(context);
    }
    triggerDirectiveParametersBefore(context) {
        this.triggerCallbacks(context, "DirectiveParametersBefore");
    }
    visitDirectiveParameter(context) {
        this.triggerDirectiveParameter(context);
    }
    triggerDirectiveParameter(context) {
        this.triggerCallbacks(context, "DirectiveParameter");
    }
    visitDirectiveParametersAfter(context) {
        this.triggerDirectiveParametersAfter(context);
    }
    triggerDirectiveParametersAfter(context) {
        this.triggerCallbacks(context, "DirectiveParametersAfter");
    }
    visitDirectiveAfter(context) {
        this.triggerDirectiveBefore(context);
    }
    triggerDirectiveAfter(context) {
        this.triggerCallbacks(context, "DirectiveAfter");
    }
    visitDirectivesAfter(context) {
        this.triggerDirectivesAfter(context);
    }
    triggerDirectivesAfter(context) {
        this.triggerCallbacks(context, "DirectivesAfter");
    }
    visitAliasesBefore(context) {
        this.triggerAliasesBefore(context);
    }
    triggerAliasesBefore(context) {
        this.triggerCallbacks(context, "AliasesBefore");
    }
    visitAliasBefore(context) {
        this.triggerAliasBefore(context);
    }
    triggerAliasBefore(context) {
        this.triggerCallbacks(context, "AliasBefore");
    }
    visitAlias(context) {
        this.triggerAlias(context);
    }
    triggerAlias(context) {
        this.triggerCallbacks(context, "Alias");
    }
    visitAliasAfter(context) {
        this.triggerAliasBefore(context);
    }
    triggerAliasAfter(context) {
        this.triggerCallbacks(context, "AliasAfter");
    }
    visitAliasesAfter(context) {
        this.triggerAliasesAfter(context);
    }
    triggerAliasesAfter(context) {
        this.triggerCallbacks(context, "AliasesAfter");
    }
    visitAllOperationsBefore(context) {
        this.triggerAllOperationsBefore(context);
    }
    triggerAllOperationsBefore(context) {
        this.triggerCallbacks(context, "AllOperationsBefore");
    }
    visitFunctionsBefore(context) {
        this.triggerFunctionsBefore(context);
    }
    triggerFunctionsBefore(context) {
        this.triggerCallbacks(context, "FunctionsBefore");
    }
    visitFunctionBefore(context) {
        this.triggerFunctionBefore(context);
    }
    triggerFunctionBefore(context) {
        this.triggerCallbacks(context, "FunctionBefore");
    }
    visitFunction(context) {
        this.triggerFunction(context);
    }
    triggerFunction(context) {
        this.triggerCallbacks(context, "Function");
    }
    visitFunctionAfter(context) {
        this.triggerFunctionAfter(context);
    }
    triggerFunctionAfter(context) {
        this.triggerCallbacks(context, "FunctionAfter");
    }
    visitFunctionsAfter(context) {
        this.triggerFunctionsAfter(context);
    }
    triggerFunctionsAfter(context) {
        this.triggerCallbacks(context, "FunctionsAfter");
    }
    visitInterfacesBefore(context) {
        this.triggerInterfacesBefore(context);
    }
    triggerInterfacesBefore(context) {
        this.triggerCallbacks(context, "InterfacesBefore");
    }
    visitInterfaceBefore(context) {
        this.triggerInterfaceBefore(context);
    }
    triggerInterfaceBefore(context) {
        this.triggerCallbacks(context, "InterfaceBefore");
    }
    visitInterface(context) {
        this.triggerInterface(context);
    }
    triggerInterface(context) {
        this.triggerCallbacks(context, "Interface");
    }
    visitOperationsBefore(context) {
        this.triggerOperationsBefore(context);
    }
    triggerOperationsBefore(context) {
        this.triggerCallbacks(context, "OperationsBefore");
    }
    visitOperationBefore(context) {
        this.triggerOperationBefore(context);
    }
    triggerOperationBefore(context) {
        this.triggerCallbacks(context, "OperationBefore");
    }
    visitOperation(context) {
        this.triggerOperation(context);
    }
    triggerOperation(context) {
        this.triggerCallbacks(context, "Operation");
    }
    visitParametersBefore(context) {
        this.triggerParametersBefore(context);
    }
    triggerParametersBefore(context) {
        this.triggerCallbacks(context, "ParametersBefore");
    }
    visitParameter(context) {
        this.triggerParameter(context);
    }
    triggerParameter(context) {
        this.triggerCallbacks(context, "Parameter");
    }
    visitParametersAfter(context) {
        this.triggerParametersAfter(context);
    }
    triggerParametersAfter(context) {
        this.triggerCallbacks(context, "ParametersAfter");
    }
    visitOperationAfter(context) {
        this.triggerOperationAfter(context);
    }
    triggerOperationAfter(context) {
        this.triggerCallbacks(context, "OperationAfter");
    }
    visitOperationsAfter(context) {
        this.triggerOperationsAfter(context);
    }
    triggerOperationsAfter(context) {
        this.triggerCallbacks(context, "OperationsAfter");
    }
    visitInterfaceAfter(context) {
        this.triggerInterfaceAfter(context);
    }
    triggerInterfaceAfter(context) {
        this.triggerCallbacks(context, "InterfaceAfter");
    }
    visitInterfacesAfter(context) {
        this.triggerInterfacesAfter(context);
    }
    triggerInterfacesAfter(context) {
        this.triggerCallbacks(context, "InterfacesAfter");
    }
    visitAllOperationsAfter(context) {
        this.triggerAllOperationsAfter(context);
    }
    triggerAllOperationsAfter(context) {
        this.triggerCallbacks(context, "AllOperationsAfter");
    }
    visitTypesBefore(context) {
        this.triggerTypesBefore(context);
    }
    triggerTypesBefore(context) {
        this.triggerCallbacks(context, "TypesBefore");
    }
    visitTypeBefore(context) {
        this.triggerTypeBefore(context);
    }
    triggerTypeBefore(context) {
        this.triggerCallbacks(context, "TypeBefore");
    }
    visitType(context) {
        this.triggerType(context);
    }
    triggerType(context) {
        this.triggerCallbacks(context, "Type");
    }
    visitTypeFieldsBefore(context) {
        this.triggerTypeFieldsBefore(context);
    }
    triggerTypeFieldsBefore(context) {
        this.triggerCallbacks(context, "TypeFieldsBefore");
    }
    visitTypeField(context) {
        this.triggerTypeField(context);
    }
    triggerTypeField(context) {
        this.triggerCallbacks(context, "TypeField");
    }
    visitTypeFieldsAfter(context) {
        this.triggerTypeFieldsAfter(context);
    }
    triggerTypeFieldsAfter(context) {
        this.triggerCallbacks(context, "TypeFieldsAfter");
    }
    visitTypeAfter(context) {
        this.triggerTypeAfter(context);
    }
    triggerTypeAfter(context) {
        this.triggerCallbacks(context, "TypeAfter");
    }
    visitTypesAfter(context) {
        this.triggerTypesAfter(context);
    }
    triggerTypesAfter(context) {
        this.triggerCallbacks(context, "TypesAfter");
    }
    visitEnumsBefore(context) {
        this.triggerEnumsBefore(context);
    }
    triggerEnumsBefore(context) {
        this.triggerCallbacks(context, "EnumsBefore");
    }
    visitEnumBefore(context) {
        this.triggerEnumsBefore(context);
    }
    triggerEnumBefore(context) {
        this.triggerCallbacks(context, "EnumBefore");
    }
    visitEnum(context) {
        this.triggerEnum(context);
    }
    triggerEnum(context) {
        this.triggerCallbacks(context, "Enum");
    }
    visitEnumValuesBefore(context) {
        this.triggerEnumValuesBefore(context);
    }
    triggerEnumValuesBefore(context) {
        this.triggerCallbacks(context, "EnumValuesBefore");
    }
    visitEnumValue(context) {
        this.triggerEnumValue(context);
    }
    triggerEnumValue(context) {
        this.triggerCallbacks(context, "EnumValue");
    }
    visitEnumValuesAfter(context) {
        this.triggerEnumValuesAfter(context);
    }
    triggerEnumValuesAfter(context) {
        this.triggerCallbacks(context, "EnumValuesAfter");
    }
    visitEnumAfter(context) {
        this.triggerEnumsAfter(context);
    }
    triggerEnumAfter(context) {
        this.triggerCallbacks(context, "EnumAfter");
    }
    visitEnumsAfter(context) {
        this.triggerEnumsAfter(context);
    }
    triggerEnumsAfter(context) {
        this.triggerCallbacks(context, "EnumsAfter");
    }
    visitUnionsBefore(context) {
        this.triggerUnionsBefore(context);
    }
    triggerUnionsBefore(context) {
        this.triggerCallbacks(context, "UnionsBefore");
    }
    visitUnion(context) {
        this.triggerCallbacks(context, "Union");
    }
    triggerUnion(context) {
        this.triggerCallbacks(context, "Union");
    }
    visitUnionsAfter(context) {
        this.triggerUnionsAfter(context);
    }
    triggerUnionsAfter(context) {
        this.triggerCallbacks(context, "UnionsAfter");
    }
    visitAnnotationsBefore(context) {
        this.triggerAnnotationsBefore(context);
    }
    triggerAnnotationsBefore(context) {
        this.triggerCallbacks(context, "AnnotationsBefore");
    }
    visitAnnotationBefore(context) {
        this.triggerAnnotationBefore(context);
    }
    triggerAnnotationBefore(context) {
        this.triggerCallbacks(context, "AnnotationBefore");
    }
    visitAnnotation(context) {
        this.triggerAnnotation(context);
    }
    triggerAnnotation(context) {
        this.triggerCallbacks(context, "Annotation");
    }
    visitAnnotationArgumentsBefore(context) {
        this.triggerAnnotationArgumentsBefore(context);
    }
    triggerAnnotationArgumentsBefore(context) {
        this.triggerCallbacks(context, "AnnotationArgumentsBefore");
    }
    visitAnnotationArgument(context) {
        this.triggerAnnotationArgument(context);
    }
    triggerAnnotationArgument(context) {
        this.triggerCallbacks(context, "AnnotationArgument");
    }
    visitAnnotationArgumentsAfter(context) {
        this.triggerAnnotationArgumentsAfter(context);
    }
    triggerAnnotationArgumentsAfter(context) {
        this.triggerCallbacks(context, "AnnotationArgumentsAfter");
    }
    visitAnnotationAfter(context) {
        this.triggerAnnotationAfter(context);
    }
    triggerAnnotationAfter(context) {
        this.triggerCallbacks(context, "AnnotationAfter");
    }
    visitAnnotationsAfter(context) {
        this.triggerAnnotationsAfter(context);
    }
    triggerAnnotationsAfter(context) {
        this.triggerCallbacks(context, "AnnotationsAfter");
    }
}
class BaseVisitor extends AbstractVisitor1 {
    writer;
    constructor(writer){
        super();
        this.writer = writer;
    }
    write(code) {
        this.writer.write(code);
    }
}
function isOneOfType(context, types) {
    if (context.interface) {
        const iface = context.interface;
        let found = false;
        for(let i = 0; i < types.length; i++){
            if (iface.annotation(types[i]) != undefined) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
        return iface.operations.find((o)=>{
            return o.annotation("nocode") == undefined;
        }) != undefined;
    }
    return false;
}
function isHandler(context) {
    return isService(context) || isEvents(context);
}
function isService(context) {
    if (context.interface) {
        const { interface: iface  } = context;
        if (iface.annotation("service") == undefined) {
            return false;
        }
        return iface.operations.find((o)=>{
            return o.annotation("nocode") == undefined;
        }) != undefined;
    }
    if (context.operation) {
        return context.operation.annotation("nocode") != undefined;
    }
    return false;
}
function hasServiceCode(context) {
    for(let name in context.namespace.interfaces){
        const role = context.namespace.interfaces[name];
        if (role.annotation("service") == undefined) {
            continue;
        }
        if (role.operations.find((o)=>{
            return o.annotation("nocode") == undefined;
        }) != undefined) {
            return true;
        }
    }
    return false;
}
function hasMethods(iface) {
    if (iface.operations.find((o)=>{
        return o.annotation("nocode") == undefined;
    }) != undefined) {
        return true;
    }
    return false;
}
function hasCode(context) {
    if (context.interface) {
        const { interface: iface  } = context;
        if (iface.annotation("service") == undefined && iface.annotation("provider") == undefined && iface.annotation("dependency") == undefined) {
            return false;
        }
        return iface.operations.find((o)=>{
            return o.annotation("nocode") == undefined;
        }) != undefined;
    }
    return false;
}
function isEvents(context) {
    if (context.interface) {
        const { interface: iface  } = context;
        if (iface.annotation("events") == undefined) {
            return false;
        }
        return iface.operations.find((o)=>{
            return o.annotation("nocode") == undefined;
        }) != undefined;
    }
    return false;
}
function isProvider(context) {
    const { interface: iface , operation  } = context;
    if (iface) {
        if (iface.annotation("provider") == undefined && iface.annotation("dependency") == undefined && iface.annotation("activities") == undefined) {
            return false;
        }
        return iface.operations.find((o)=>{
            return o.annotation("nocode") == undefined;
        }) != undefined;
    }
    if (operation && operation.annotation("provider")) {
        return true;
    }
    return false;
}
function noCode(annotated) {
    if (annotated) {
        return annotated.annotation("nocode") != undefined;
    }
    return false;
}
function isVoid(t) {
    return t.kind === Kind.Void;
}
function isNamed(t) {
    switch(t.kind){
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            return true;
    }
    return false;
}
function isObject(t, recurseOption = true) {
    while(t.kind == Kind.Alias || t.kind == Kind.Optional){
        if (t.kind == Kind.Optional) {
            if (recurseOption) {
                t = t.type;
            } else {
                break;
            }
        } else if (t.kind == Kind.Alias) {
            t = t.type;
        }
    }
    switch(t.kind){
        case Kind.Type:
        case Kind.Union:
            return true;
    }
    return false;
}
function isPrimitive(t) {
    return t.kind === Kind.Primitive;
}
function visitNamed(t, callback) {
    if (!t) {
        return;
    }
    switch(t.kind){
        case Kind.Type:
            const named = t;
            callback(named.name);
            break;
        case Kind.Optional:
            visitNamed(t.type, callback);
            break;
        case Kind.List:
            visitNamed(t.type, callback);
            break;
        case Kind.Map:
            const m = t;
            visitNamed(m.keyType, callback);
            visitNamed(m.valueType, callback);
            break;
    }
}
const primitives1 = new Set([
    "bool",
    "i8",
    "i16",
    "i32",
    "i64",
    "u8",
    "u16",
    "u32",
    "u64",
    "f32",
    "f64",
    "string"
]);
function formatComment(prefix, text, wrapLength = 80) {
    if (text == undefined) {
        return "";
    }
    let textValue = "";
    if (!text || typeof text === "string") {
        textValue = text;
    }
    for(i = 1; i < textValue.length - 1; i++){
        if (textValue[i] == "\n" && textValue[i - 1] != "\n" && textValue[i + 1] != "\n") {
            textValue = textValue.substring(0, i) + " " + textValue.substring(i + 1);
        }
    }
    let comment = "";
    let line = "";
    let word = "";
    for(var i = 0; i < textValue.length; i++){
        let c = textValue[i];
        if (c == " " || c == "\n") {
            if (line.length + word.length > wrapLength) {
                if (comment.length > 0) {
                    comment += "\n";
                }
                comment += prefix + line.trim();
                line = word.trim();
                word = " ";
            } else if (c == "\n") {
                line += word;
                if (comment.length > 0) {
                    comment += "\n";
                }
                comment += prefix + line.trim();
                line = "";
                word = "";
            } else {
                line += word;
                word = c;
            }
        } else {
            word += c;
        }
    }
    if (line.length + word.length > wrapLength) {
        if (comment.length > 0) {
            comment += "\n";
        }
        comment += prefix + line.trim();
        line = word.trim();
    } else {
        line += word;
    }
    if (line.length > 0) {
        if (comment.length > 0) {
            comment += "\n";
        }
        comment += prefix + line.trim();
    }
    if (comment.length > 0) {
        comment += "\n";
    }
    return comment;
}
function camelCaseTransform(input, index) {
    if (index === 0) return input.toLowerCase();
    return pascalCaseTransform(input, index);
}
function camelCaseTransformMerge(input, index) {
    if (index === 0) return input.toLowerCase();
    return pascalCaseTransformMerge(input);
}
function camelCase(input, options = {}) {
    return pascalCase(input, {
        transform: camelCaseTransform,
        ...options
    });
}
function pascalCaseTransform(input, index) {
    const firstChar = input.charAt(0);
    const lowerChars = input.substr(1).toLowerCase();
    if (index > 0 && firstChar >= "0" && firstChar <= "9") {
        return `_${firstChar}${lowerChars}`;
    }
    return `${firstChar.toUpperCase()}${lowerChars}`;
}
function pascalCaseTransformMerge(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
function pascalCase(input, options = {}) {
    return noCase(input, {
        delimiter: "",
        transform: pascalCaseTransform,
        ...options
    });
}
function snakeCase(input, options = {}) {
    return dotCase(input, {
        delimiter: "_",
        ...options
    });
}
function dotCase(input, options = {}) {
    return noCase(input, {
        delimiter: ".",
        ...options
    });
}
const DEFAULT_SPLIT_REGEXP = [
    /([a-z0-9])([A-Z])/g,
    /([A-Z])([A-Z][a-z])/g
];
const DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
function noCase(input, options = {}) {
    const { splitRegexp =DEFAULT_SPLIT_REGEXP , stripRegexp =DEFAULT_STRIP_REGEXP , transform =lowerCase , delimiter =" "  } = options;
    let result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    let start = 0;
    let end = result.length;
    while(result.charAt(start) === "\0")start++;
    while(result.charAt(end - 1) === "\0")end--;
    return result.slice(start, end).split("\0").map(transform).join(delimiter);
}
function replace(input, re, value) {
    if (re instanceof RegExp) return input.replace(re, value);
    return re.reduce((input, re)=>input.replace(re, value), input);
}
const SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069"
        }
    },
    az: {
        regexp: /\u0130/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069"
        }
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303"
        }
    }
};
function localeLowerCase(str, locale) {
    const lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang) return lowerCase(str.replace(lang.regexp, (m)=>lang.map[m]));
    return lowerCase(str);
}
function lowerCase(str) {
    return str.toLowerCase();
}
function capitalize(str) {
    if (str.length == 0) return str;
    if (str.length == 1) return str[0].toUpperCase();
    return str[0].toUpperCase() + str.slice(1);
}
function uncapitalize(str) {
    if (str.length == 0) return str;
    if (str.length == 1) return str[0].toLowerCase();
    return str[0].toLowerCase() + str.slice(1);
}
function capitalizeRename(annotated, str) {
    const rename = renamed(annotated);
    if (rename != undefined) {
        return rename;
    }
    return capitalize(str);
}
function renamed(annotated, defaultVal) {
    let ret = defaultVal;
    annotated.annotation("rename", (a)=>{
        const rename = a.convert();
        ret = rename.value.go;
    });
    return ret;
}
function interfaceTypeName(iface) {
    return capitalize(renamed(iface, iface.name));
}
function operationTypeName(operation) {
    return capitalize(renamed(operation, operation.name));
}
function operationArgsType(iface, operation, prefix) {
    return (prefix || "") + (iface ? interfaceTypeName(iface) : "") + operationTypeName(operation) + "Args";
}
function convertOperationToType(tr, iface, operation, prefix) {
    const parameters = operation.parameters.filter((p)=>p.type.kind != Kind.Stream);
    var fields = parameters.map((param)=>{
        return new FieldDefinition(param.node.loc, param.node.name, param.node.description, param.node.type, param.node.default, param.node.annotations);
    });
    return new Type(tr, new TypeDefinition(operation.node.loc, new Name(operation.node.name.loc, operationArgsType(iface, operation, prefix)), undefined, [], operation.node.annotations, fields));
}
function convertUnionToType(tr, union) {
    var fields = union.types.map((param)=>{
        const n = typeName(param);
        const t = modelToAST(param);
        return new FieldDefinition(undefined, new Name(undefined, n), undefined, new Optional1(undefined, t), undefined, []);
    });
    return new Type(tr, new TypeDefinition(union.node.loc, new Name(union.node.name.loc, union.name), union.description != undefined ? new StringValue(undefined, union.description) : undefined, [], union.node.annotations, fields));
}
function modelToAST(t) {
    switch(t.kind){
        case Kind.Primitive:
            {
                const p = t;
                return new Named(undefined, new Name(undefined, p.name));
            }
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            {
                const a = t;
                return new Named(undefined, new Name(undefined, a.name));
            }
        case Kind.Stream:
            {
                const o = t;
                return new Stream1(undefined, modelToAST(o.type));
            }
        case Kind.Optional:
            {
                const o1 = t;
                return new Optional1(undefined, modelToAST(o1.type));
            }
        case Kind.List:
            {
                const l = t;
                return new ListType(undefined, modelToAST(l.type));
            }
        case Kind.Map:
            {
                const l1 = t;
                return new MapType(undefined, modelToAST(l1.keyType), modelToAST(l1.keyType));
            }
    }
    return new Named(undefined, new Name(undefined, "????"));
}
function typeName(t) {
    switch(t.kind){
        case Kind.Primitive:
            {
                const p = t;
                return p.name;
            }
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            {
                const a = t;
                return a.name;
            }
        case Kind.Stream:
            {
                const s = t;
                return "stream{" + modelToAST(s.type) + "}";
            }
        case Kind.Optional:
            {
                const o = t;
                return "optional{" + modelToAST(o.type) + "}";
            }
        case Kind.List:
            {
                const l = t;
                return "list{" + modelToAST(l.type) + "}";
            }
        case Kind.Map:
            {
                const l1 = t;
                return "map{" + modelToAST(l1.keyType) + "," + modelToAST(l1.keyType) + "}";
            }
    }
    return "????";
}
function convertArrayToObject(array, keyFunc, convert = (value)=>value) {
    const obj = {};
    array.forEach((value)=>{
        const keyVal = keyFunc(value);
        obj[keyVal] = convert(value);
    });
    return obj;
}
function unwrapKinds(t, ...kinds) {
    while(true){
        if (isKinds(t, ...kinds)) {
            switch(t.kind){
                case Kind.Alias:
                    t = t.type;
                    break;
                case Kind.Optional:
                    t = t.type;
                    break;
                case Kind.List:
                    t = t.type;
                    break;
                case Kind.Map:
                    t = t.valueType;
                    break;
                case Kind.Stream:
                    t = t.type;
                    break;
                default:
                    return t;
            }
        } else {
            return t;
        }
    }
}
function isKinds(t, ...kinds) {
    return kinds.indexOf(t.kind) != -1;
}
function codegenType(t) {
    switch(t.kind){
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Union:
        case Kind.Type:
            return t.name;
        case Kind.Primitive:
            return t.name;
        case Kind.Map:
            const m = t;
            return `{${codegenType(m.keyType)}: ${codegenType(m.valueType)}}`;
        case Kind.List:
            const l = t;
            return `[${codegenType(l.type)}]`;
        case Kind.Optional:
            return `${codegenType(t.type)}?`;
        default:
            throw new Error(`Can not codegen type ${t.kind}`);
    }
}
const defaultNineBox = [
    [
        "/**",
        "*",
        "**"
    ],
    [
        " * ",
        " ",
        " *"
    ],
    [
        " **",
        "*",
        "*/"
    ]
];
function fillToLengthWith(base, len, filler) {
    const left = len - base.length;
    const numFill = Math.ceil(left / filler.length);
    return base + filler.repeat(numFill);
}
function nineBoxRow(rowDef, content, rowLength) {
    return `${rowDef[0]}${fillToLengthWith(content, rowLength - rowDef[0].length - rowDef[2].length, rowDef[1])}${rowDef[2]}`;
}
function generatedHeader(lines, nineBox = defaultNineBox) {
    const maxLength = lines.reduce((acc, next)=>next.length > acc ? next.length : acc, 0) + nineBox[1][0].length + nineBox[1][2].length;
    const newLines = [];
    newLines.push(nineBoxRow(nineBox[0], nineBox[0][1], maxLength));
    for(let i = 0; i < lines.length; i++){
        newLines.push(nineBoxRow(nineBox[1], lines[i], maxLength));
    }
    newLines.push(nineBoxRow(nineBox[2], nineBox[2][1], maxLength));
    return newLines.join("\n");
}
const OMIT_KEYS = [
    "node",
    "source"
];
function inspect(o, omit = OMIT_KEYS) {
    console.log(JSON.stringify(o, (k, v)=>OMIT_KEYS.indexOf(k) === -1 ? v : undefined));
}
function isRecursiveType(typ, seen = []) {
    if (isNamed(typ)) {
        if (seen.find((t)=>t.name == typ.name)) return true;
        seen.push(typ);
    }
    switch(typ.kind){
        case Kind.List:
            {
                const t = typ;
                return isRecursiveType(t.type, seen);
            }
        case Kind.Map:
            {
                const t1 = typ;
                return isRecursiveType(t1.keyType, seen) || isRecursiveType(t1.valueType, seen);
            }
        case Kind.Optional:
            {
                const t2 = typ;
                return isRecursiveType(t2.type, seen);
            }
        case Kind.Union:
            {
                const t3 = typ;
                return t3.types.filter((t)=>isRecursiveType(t, seen)).length > 0;
            }
        case Kind.Type:
            {
                const t4 = typ;
                return t4.fields.filter((v)=>isRecursiveType(v.type, seen)).length > 0;
            }
        case Kind.Enum:
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Void:
            {
                return false;
            }
        default:
            {
                throw new Error(`Unhandled type: ${typ.kind}`);
            }
    }
}
class ExposedTypesVisitor extends BaseVisitor {
    found = new Set();
    checkType(any) {
        if (isNamed(any)) {
            const n = any;
            if (!this.found.has(n.name)) {
                this.found.add(n.name);
            } else {
                return;
            }
        }
        switch(any.kind){
            case Kind.Optional:
                const o = any;
                this.checkType(o.type);
                break;
            case Kind.Type:
                const t = any;
                t.fields.forEach((field)=>this.checkType(field.type));
                break;
            case Kind.Union:
                const u = any;
                u.types.forEach((t)=>this.checkType(t));
                break;
            case Kind.Alias:
                const a = any;
                this.checkType(a.type);
                break;
            case Kind.Map:
                const m = any;
                this.checkType(m.keyType);
                this.checkType(m.valueType);
                break;
            case Kind.List:
                const l = any;
                this.checkType(l.type);
                break;
        }
    }
    visitOperation(context) {
        if (!isService(context)) {
            return;
        }
        const { operation  } = context;
        this.checkType(operation.type);
    }
    visitParameter(context) {
        if (!isService(context)) {
            return;
        }
        const { parameter  } = context;
        this.checkType(parameter.type);
    }
}
class InterfaceUsesVisitor extends BaseVisitor {
    services = new Map();
    dependencies = [];
    visitInterface(context) {
        const { interface: iface  } = context;
        if (isService(context)) {
            let dependencies = [];
            iface.annotation("uses", (a)=>{
                if (a.arguments.length > 0) {
                    dependencies = a.arguments[0].value.getValue();
                }
            });
            this.services.set(iface.name, dependencies);
        }
        if (isProvider(context)) {
            this.dependencies.push(iface.name);
        }
    }
}
const mod = {
    ExposedTypesVisitor,
    isOneOfType,
    isHandler,
    isService,
    hasServiceCode,
    hasMethods,
    hasCode,
    isEvents,
    isProvider,
    noCode,
    isVoid,
    isNamed,
    isObject,
    isPrimitive,
    visitNamed,
    primitives: primitives1,
    formatComment,
    camelCaseTransform,
    camelCaseTransformMerge,
    camelCase,
    pascalCaseTransform,
    pascalCaseTransformMerge,
    pascalCase,
    snakeCase,
    dotCase,
    noCase,
    localeLowerCase,
    lowerCase,
    capitalize,
    uncapitalize,
    capitalizeRename,
    renamed,
    interfaceTypeName,
    operationTypeName,
    operationArgsType,
    convertOperationToType,
    convertUnionToType,
    modelToAST,
    typeName,
    convertArrayToObject,
    unwrapKinds,
    isKinds,
    codegenType,
    generatedHeader,
    inspect,
    isRecursiveType,
    InterfaceUsesVisitor
};
const translations = new Map([
    [
        "ID",
        "string"
    ],
    [
        "string",
        "string"
    ],
    [
        "bytes",
        "byte[]"
    ],
    [
        "datetime",
        "DateTime"
    ],
    [
        "any",
        "object"
    ],
    [
        "raw",
        "object"
    ],
    [
        "i64",
        "long"
    ],
    [
        "i32",
        "int"
    ],
    [
        "i16",
        "short"
    ],
    [
        "i8",
        "sbyte"
    ],
    [
        "u64",
        "ulong"
    ],
    [
        "u32",
        "uint"
    ],
    [
        "u16",
        "ushort"
    ],
    [
        "u8",
        "byte"
    ],
    [
        "f64",
        "double"
    ],
    [
        "f32",
        "float"
    ]
]);
const expandType = (type)=>{
    switch(type.kind){
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            const namedValue = type.name;
            return translations.get(namedValue) ?? pascalCase(namedValue);
        case Kind.Map:
            return `Dictionary<${expandType(type.keyType)}, ${expandType(type.valueType)}>`;
        case Kind.List:
            return `List<${expandType(type.type)}>`;
        case Kind.Void:
            return `void`;
        case Kind.Optional:
            return `${expandType(type.type)}?`;
        default:
            return "object";
    }
};
const parseNamespaceName = (name)=>{
    return name.split(".").map((n)=>pascalCase(n)).join(".");
};
class MinimalAPIVisitor extends BaseVisitor {
    visitNamespaceBefore(context) {
        this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.\n\n`);
        this.write(`using System;\nusing Microsoft.AspNetCore.Builder;\n\n`);
        super.visitNamespaceBefore(context);
    }
    visitNamespace(context) {
        this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);
        super.visitNamespace(context);
    }
    visitNamespaceAfter(context) {
        this.write(`}\n`);
        super.visitNamespaceAfter(context);
    }
    visitInterfaceBefore(context) {
        if (!isService(context)) {
            return;
        }
        const { interface: iface  } = context;
        const visitor = new ApiServiceVisitor(this.writer);
        iface.accept(context, visitor);
    }
}
class ApiServiceVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        let path = "";
        context.namespace.annotation("path", (a)=>{
            path = a?.convert().value;
        });
        this.write(`  public class Setup {\n`);
        this.write(`    public Setup(WebApplication app, ${pascalCase(context.interface.name)} service) {\n`);
        for (const method of context.interface.operations){
            let subPath = "";
            method.annotation("path", (a)=>{
                subPath = a?.convert().value;
            });
            this.write(`      app.`);
            if (method.annotation("GET")) {
                this.write(`MapGet`);
            } else if (method.annotation("POST")) {
                this.write(`MapPost`);
            } else if (method.annotation("PUT")) {
                this.write(`MapPut`);
            } else if (method.annotation("DELETE")) {
                this.write(`MapDelete`);
            }
            this.write(`("${path}${subPath}", (`);
            let params = [];
            if (method.parameters.length > 0) {
                for(let i = 0; i < method.parameters.length; ++i){
                    const param = method.parameters[i];
                    const type = translations.get(expandType(param.type)) || expandType(param.type);
                    this.write(`${type} ${param.name}${i != method.parameters.length - 1 ? ", " : ""}`);
                    params.push(param.name);
                }
            }
            this.write(`) => service.${pascalCase(method.name)}(${params.join(", ")}));\n`);
        }
        this.write(`    }\n  }\n`);
    }
}
class TypeVisitor extends BaseVisitor {
    visitTypeBefore(context) {
        const { type  } = context;
        this.write(formatComment("  // ", type.description));
        this.write(`  public record ${pascalCase(type.name)}\n  {\n`);
        super.visitTypesBefore(context);
    }
    visitTypeField(context) {
        if (context.fieldIndex > 0) {
            this.write(`\n`);
        }
        const { field  } = context;
        const type = expandType(field.type);
        const range = field.annotation("range");
        const email = field.annotation("email");
        const notEmpty = field.annotation("notEmpty");
        if (range || email || notEmpty) {
            const name = camelCase(field.name);
            let propName = pascalCase(field.name);
            this.write(`    private ${type} ${name};`);
            this.write(formatComment("    // ", field.description));
            this.write(`\t ${type} ${propName}\n`);
            this.write("    {\n");
            this.write(`      get { return this.${name}; }\n`);
            this.write("      set {\n\n");
            if (email && type === "string") {
                this.write('        if (!System.Text.RegularExpressions.Regex.IsMatch(value, @"^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$")) {\n');
                this.write(`          throw new ArgumentException("value must be an email address", "${propName}");\n`);
                this.write("        }\n");
            }
            if (range && type === "string") {
                const { min , max  } = getRangeArguments(range.arguments);
                this.write("        if (");
                if (min) {
                    this.write(`value.Length < ${min}`);
                }
                if (min && max) {
                    this.write(" || ");
                }
                if (max) {
                    this.write(`value.Length > ${max}`);
                }
                this.write("  ) {\n");
                this.write(`          throw new ArgumentException("value must be in range", "${propName}");\n`);
                this.write("        }\n");
            }
            this.write(`        this.${name} = value;\n`);
            this.write("      }\n");
            this.write("    }\n");
        } else {
            this.write(formatComment("    // ", field.description));
            this.write(`\t public ${type} ${pascalCase(field.name)}`);
            this.write("   { get; set; }\n");
        }
    }
    visitTypeAfter(context) {
        this.write("  }\n\n");
        super.visitTypeAfter(context);
    }
}
function getRangeArguments(args) {
    let obj = {
        min: undefined,
        max: undefined
    };
    for (const arg of args){
        obj[arg.name] = arg.value.getValue();
    }
    return obj;
}
class ScaffoldVisitor extends BaseVisitor {
    visitNamespace(context) {
        this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);
        const service = new ServiceVisitor(this.writer);
        context.namespace.accept(context, service);
        super.visitNamespace(context);
    }
    visitNamespaceAfter(context) {
        this.write(`}\n`);
        super.visitNamespaceAfter(context);
    }
}
class ServiceVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        if (!isValid(context)) {
            return;
        }
        const { interface: iface  } = context;
        let dependencies = [];
        iface.annotation("uses", (a)=>{
            if (a.arguments.length > 0) {
                dependencies = a.arguments[0].value.getValue();
            }
        });
        this.write(`  public class ${iface.name}Impl : ${iface.name} {\n`);
        dependencies.map((value, index)=>{
            this.write(`    private ${value} ${value.toLowerCase()};\n`);
            if (index == dependencies.length - 1) this.write(`\n`);
        });
        dependencies.map((value, index)=>{
            this.write(`    public ${iface.name}Impl (${value}Impl ${value.toLowerCase()}) {\n`);
            this.write(`      this.${value.toLowerCase()} = ${value.toLowerCase()};\n`);
            this.write(`\t }\n`);
            if (index == dependencies.length - 1) this.write(`\n`);
        });
        super.visitInterfaceBefore(context);
    }
    visitInterface(context) {
        if (!isValid(context)) {
            return;
        }
        const operations = context.interface.operations;
        for(let i = 0; i < operations.length; ++i){
            if (i > 0) {
                this.write(`\n`);
            }
            const operation = operations[i];
            const type = expandType(operation.type);
            this.write(formatComment("    // ", operation.description));
            this.write(`    public ${type} ${pascalCase(operation.name)}(`);
            const parameters = operation.parameters;
            for(let j = 0; j < parameters.length; ++j){
                const parameter = parameters[j];
                this.write(`${expandType(parameter.type)} ${parameter.name}`);
                if (j < parameters.length - 1) this.write(`, `);
            }
            this.write(`)\n    {\n`);
            if (type == "void") {
                this.write(`      return; // TODO: Provide implementation.\n`);
            } else {
                this.write(`      return new ${type}(); // TODO: Provide implementation.\n`);
            }
            this.write(`    }\n`);
        }
        this.write(`  }\n\n`);
        super.visitInterface(context);
    }
}
function isValid(context) {
    const roleNames = context.config.names || [];
    const roleTypes = context.config.types || [];
    const { interface: iface  } = context;
    return isOneOfType(context, roleTypes) || roleNames.indexOf(iface.name) != -1;
}
class InterfaceVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        this.write(formatComment("  // ", context.interface.description));
        this.write(`  public interface ${pascalCase(context.interface.name)}\n  {\n`);
        super.visitInterfaceBefore(context);
    }
    visitInterface(context) {
        const operations = context.interface.operations;
        for(let i = 0; i < operations.length; ++i){
            const operation = operations[i];
            const type = expandType(operation.type);
            if (i > 0) {
                this.write(`\n`);
            }
            this.write(formatComment("    // ", operation.description));
            this.write(`    public ${type} ${pascalCase(operation.name)}(`);
            const parameters = operation.parameters;
            for(let j = 0; j < parameters.length; ++j){
                const parameter = parameters[j];
                this.write(`${expandType(parameter.type)} ${parameter.name}`);
                if (j < parameters.length - 1) this.write(`, `);
            }
            this.write(`);\n`);
        }
        super.visitInterface(context);
    }
    visitInterfaceAfter(context) {
        this.write("  }\n\n");
        super.visitInterfaceAfter(context);
    }
}
class EnumVisitor extends BaseVisitor {
    visitEnumBefore(context) {
        this.write(formatComment("  // ", context.enum.description));
        this.write(`  public enum ${pascalCase(context.enum.name)}\n  {\n`);
        super.visitEnumBefore(context);
    }
    visitEnumAfter(context) {
        this.write("  }\n");
        this.write(`
  public static class Extensions
  {
    public static int Value(this ${context.enum.name} enumValue)
    {
      //Do something here
      return (int)enumValue;
    }
  }\n`);
        super.visitEnumAfter(context);
    }
    visitEnum(context) {
        const values = context.enum.values;
        for(let i = 0; i < values.length; ++i){
            this.write(`    ${pascalCase(values[i].name)}`);
            if (i != values.length - 1) {
                this.write(`,`);
            }
            this.write(`\n`);
        }
        super.visitEnum(context);
    }
}
const translations1 = new Map([
    [
        "ID",
        "string"
    ],
    [
        "string",
        "string"
    ],
    [
        "bytes",
        "[]byte"
    ],
    [
        "i8",
        "int8"
    ],
    [
        "i16",
        "int16"
    ],
    [
        "i32",
        "int32"
    ],
    [
        "i64",
        "int64"
    ],
    [
        "u8",
        "uint8"
    ],
    [
        "u16",
        "uint16"
    ],
    [
        "u32",
        "uint32"
    ],
    [
        "u64",
        "uint64"
    ],
    [
        "f32",
        "float32"
    ],
    [
        "f64",
        "float64"
    ],
    [
        "datetime",
        "time.Time"
    ]
]);
function mapVals(vd, sep, delimiter, translate) {
    return vd.map((vd)=>`${vd.name}${sep} ${expandType1(vd.type, undefined, true, translate)}`).join(delimiter);
}
function defValue(fieldDef) {
    fieldDef.name;
    const type = fieldDef.type;
    if (fieldDef.default) {
        let returnVal = fieldDef.default.getValue();
        if (fieldDef.type.kind == Kind.Primitive) {
            returnVal = fieldDef.type.name == PrimitiveName.String ? strQuote(returnVal) : returnVal;
        }
        return returnVal;
    }
    switch(type.kind){
        case Kind.Optional:
            return "nil";
        case Kind.List:
        case Kind.Map:
            return `new ${expandType1(type, undefined, false)}()`;
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            switch(type.name){
                case "ID":
                case "string":
                    return '""';
                case "bool":
                    return "false";
                case "i8":
                case "u8":
                case "i16":
                case "u16":
                case "i32":
                case "u32":
                case "i64":
                case "u64":
                case "f32":
                case "f64":
                    return "0";
                case "bytes":
                    return "[]byte{}";
                default:
                    return `${capitalize(type.name)}()`;
            }
    }
    return `???${expandType1(type, undefined, false)}???`;
}
function returnPointer(type) {
    if (type.kind === Kind.Alias) {
        type = type.type;
    }
    if (type.kind === Kind.Type) {
        return "*";
    }
    return "";
}
function returnShare(type) {
    if (type.kind === Kind.Alias) {
        type = type.type;
    }
    if (type.kind === Kind.Type) {
        return "&";
    }
    return "";
}
function defaultValueForType(context, type, packageName) {
    switch(type.kind){
        case Kind.Optional:
            return "nil";
        case Kind.List:
        case Kind.Map:
            return type.kind;
        case Kind.Enum:
            return type.name + "(0)";
        case Kind.Alias:
            const aliases = context.config.aliases || {};
            const a = type;
            const imp = aliases[a.name];
            if (imp) {
                return imp.type + "{}";
            }
        case Kind.Primitive:
        case Kind.Type:
        case Kind.Union:
            const name = type.name;
            switch(name){
                case "ID":
                case "string":
                    return '""';
                case "bool":
                    return "false";
                case "i8":
                case "u8":
                case "i16":
                case "u16":
                case "i32":
                case "u32":
                case "i64":
                case "u64":
                case "f32":
                case "f64":
                    return "0";
                case "bytes":
                    return "[]byte{}";
                default:
                    const namedType = context.namespace.allTypes[name];
                    if (namedType && namedType.kind === Kind.Alias) {
                        const otherType = namedType.type;
                        return defaultValueForType(context, otherType, packageName);
                    }
                    const prefix = packageName != undefined && packageName != "" ? packageName + "." : "";
                    return `${prefix}${capitalize(name)}{}`;
            }
    }
    return "???";
}
const strQuote = (s)=>{
    return `\"${s}\"`;
};
var expandStreamPattern = `{{type}}`;
function setExpandStreamPattern(pattern) {
    expandStreamPattern = pattern;
}
const expandType1 = (type, packageName, useOptional = false, translate)=>{
    let translation = undefined;
    if (type.kind == Kind.Primitive) {
        const p = type;
        if (p.name == PrimitiveName.Any) {
            return "interface{}";
        }
    }
    switch(type.kind){
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            var namedValue = type.name;
            if (translate != undefined) {
                namedValue = translate(namedValue) || namedValue;
            }
            translation = translations1.get(namedValue);
            if (translation != undefined) {
                return translation;
            }
            if (type.kind == Kind.Type && packageName != undefined && packageName != "") {
                return packageName + "." + namedValue;
            }
            return namedValue;
        case Kind.Map:
            return `map[${expandType1(type.keyType, packageName, true, translate)}]${expandType1(type.valueType, packageName, true, translate)}`;
        case Kind.List:
            return `[]${expandType1(type.type, packageName, true, translate)}`;
        case Kind.Optional:
            const nestedType = type.type;
            let expanded = expandType1(nestedType, packageName, true, translate);
            if (useOptional && !(nestedType.kind === Kind.Map || nestedType.kind === Kind.List || expanded == "[]byte")) {
                return `*${expanded}`;
            }
            return expanded;
        case Kind.Stream:
            const s = type;
            return expandStreamPattern.replace("{{type}}", expandType1(s.type, packageName, true, translate));
        default:
            return "unknown";
    }
};
function fieldName(annotated, name) {
    const rename = annotated ? renamed(annotated) : undefined;
    if (rename != undefined) {
        return rename;
    }
    let str = capitalize(name);
    if (str.endsWith("Id")) {
        str = str.substring(0, str.length - 2) + "ID";
    } else if (str.endsWith("Url")) {
        str = str.substring(0, str.length - 3) + "URL";
    } else if (str.endsWith("Uri")) {
        str = str.substring(0, str.length - 3) + "URI";
    }
    return str;
}
function methodName(annotated, name) {
    return fieldName(annotated, name);
}
function parameterName(annotated, name) {
    const rename = renamed(annotated);
    if (rename != undefined) {
        return rename;
    }
    let str = name;
    if (str.endsWith("Id")) {
        str = str.substring(0, str.length - 2) + "ID";
    } else if (str.endsWith("Url")) {
        str = str.substring(0, str.length - 3) + "URL";
    } else if (str.endsWith("Uri")) {
        str = str.substring(0, str.length - 3) + "URI";
    }
    return str;
}
function opsAsFns(context, ops) {
    return ops.map((op)=>{
        return `func ${op.name}(${mapParams(context, op.parameters)}) ${expandType1(op.type, undefined, true)} {\n}`;
    }).join("\n");
}
function mapParams(context, args, packageName, translate) {
    return `ctx context.Context` + (args.length > 0 ? ", " : "") + args.map((arg)=>{
        return mapParam(context, arg, packageName, translate);
    }).join(", ");
}
function mapParam(context, arg, packageName, translate) {
    return `${parameterName(arg, arg.name)} ${returnPointer(arg.type)}${expandType1(arg.type, packageName, true, translate)}`;
}
function varAccessArg(context, variable, args) {
    return args.map((arg)=>{
        return `${returnShare(arg.type)}${variable}.${fieldName(arg, arg.name)}`;
    }).join(", ");
}
function receiver(iface) {
    return iface.name[0].toLowerCase();
}
function translateAlias({ config  }) {
    const aliases = config.aliases;
    if (aliases == undefined) {
        return ()=>undefined;
    }
    return function(named) {
        const i = aliases[named];
        if (i == undefined) {
            return undefined;
        }
        return i.type;
    };
}
class AliasVisitor extends BaseVisitor {
    visitAlias(context) {
        const { config , alias  } = context;
        const aliases = config.aliases;
        if (aliases && aliases[alias.name]) {
            return;
        }
        this.write(formatComment("// ", alias.description));
        this.write(`type ${alias.name} ${expandType1(alias.type, undefined, true, translateAlias(context))}\n\n`);
        super.triggerTypeField(context);
    }
}
class EnumVisitor1 extends BaseVisitor {
    visitEnumBefore(context) {
        super.triggerEnumsBefore(context);
        this.write(formatComment("// ", context.enum.description));
        this.write(`type ${context.enum.name} int32

    const (\n`);
    }
    visitEnumValue(context) {
        const { enumValue  } = context;
        this.write(formatComment("// ", enumValue.description));
        this.write(`\t${context.enum.name}${pascalCase(enumValue.name)} ${context.enum.name} = ${enumValue.index}\n`);
        super.triggerTypeField(context);
    }
    visitEnumAfter(context) {
        this.write(`)\n\n`);
        const toStringVisitor = new EnumVisitorToStringMap(this.writer);
        context.enum.accept(context, toStringVisitor);
        const toIDVisitor = new EnumVisitorToIDMap(this.writer);
        context.enum.accept(context, toIDVisitor);
        this.write(`func (e ${context.enum.name}) Type() string {
      return "${context.enum.name}"
    }

    func (e ${context.enum.name}) String() string {
      str, ok := toString${context.enum.name}[e]
      if !ok {
        return "unknown"
      }
      return str
    }

    func (e *${context.enum.name}) FromString(str string) (ok bool) {
      *e, ok = toID${context.enum.name}[str]
      return ok
    }\n\n`);
        const jsonSupport = context.config.noEnumJSON ? !context.config.noEnumJSON : true;
        if (jsonSupport) {
            this.write(`// MarshalJSON marshals the enum as a quoted json string
func (e ${context.enum.name}) MarshalJSON() ([]byte, error) {
  return json.Marshal(e.String())
}

// UnmarshalJSON unmashals a quoted json string to the enum value
func (e *${context.enum.name}) UnmarshalJSON(b []byte) error {
	var str string
	err := json.Unmarshal(b, &str)
	if err != nil {
		return err
	}
  if !e.FromString(str) {
		return fmt.Errorf("unknown value %q for ${context.enum.name}", str)
	}
	return nil
}
\n\n`);
        }
        super.triggerEnumsAfter(context);
    }
}
class EnumVisitorToStringMap extends BaseVisitor {
    visitEnumBefore(context) {
        super.triggerEnumsBefore(context);
        this.write(`var toString${context.enum.name} = map[${context.enum.name}]string{\n`);
    }
    visitEnumValue(context) {
        const { enumValue  } = context;
        const display = enumValue.display ? enumValue.display : enumValue.name;
        this.write(`\t${context.enum.name}${pascalCase(enumValue.name)}:"${display}",\n`);
        super.triggerTypeField(context);
    }
    visitEnumAfter(context) {
        this.write(`}\n\n`);
        super.triggerEnumsAfter(context);
    }
}
class EnumVisitorToIDMap extends BaseVisitor {
    visitEnumBefore(context) {
        super.triggerEnumsBefore(context);
        this.write(`var toID${context.enum.name} = map[string]${context.enum.name}{\n`);
    }
    visitEnumValue(context) {
        const { enumValue  } = context;
        const display = enumValue.display ? enumValue.display : enumValue.name;
        this.write(`\t"${display}": ${context.enum.name}${pascalCase(enumValue.name)},\n`);
        super.triggerTypeField(context);
    }
    visitEnumAfter(context) {
        this.write(`}\n\n`);
        super.triggerEnumsAfter(context);
    }
}
function getPath(context) {
    const ns = context.namespace;
    const inter = context.interface;
    const { interface: iface , operation  } = context;
    let path = "";
    ns.annotation("path", (a)=>{
        path += a.convert().value;
    });
    if (inter) {
        inter.annotation("path", (a)=>{
            path += a.convert().value;
        });
    }
    if (iface) {
        iface.annotation("path", (a)=>{
            path += a.convert().value;
        });
    }
    operation.annotation("path", (a)=>{
        path += a.convert().value;
    });
    return path;
}
function getMethods(oper) {
    return [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HEAD",
        "OPTIONS"
    ].filter((m)=>oper.annotation(m) != undefined);
}
function hasBody(method) {
    switch(method.toUpperCase()){
        case "POST":
        case "PUT":
        case "PATCH":
            return true;
    }
    return false;
}
const mod1 = {
    getPath: getPath,
    getMethods: getMethods,
    hasBody: hasBody
};
class StructVisitor extends BaseVisitor {
    writeTypeInfo;
    constructor(writer, writeTypeInfo = false){
        super(writer);
        this.writeTypeInfo = writeTypeInfo;
    }
    visitTypeBefore(context) {
        const { type  } = context;
        super.triggerTypeBefore(context);
        this.write(formatComment("// ", type.description));
        this.write(`type ${type.name} struct {\n`);
        if (this.writeTypeInfo) {
            this.write(`  ns\n`);
        }
    }
    visitTypeField(context) {
        const { field , type  } = context;
        const packageName = context.config.otherPackage;
        const omitempty = field.type.kind === Kind.Optional ? ",omitempty" : "";
        this.write(formatComment("// ", field.description));
        const ptr = field.type.kind === Kind.Type && field.type.name == type.name ? "*" : "";
        this.write(`\t${fieldName(field, field.name)} ${ptr}${expandType1(field.type, packageName, true, translateAlias(context))} \`json:"${field.name}${omitempty}" yaml:"${field.name}${omitempty}" msgpack:"${field.name}${omitempty}"`);
        this.triggerCallbacks(context, "StructTags");
        this.write(`\`\n`);
        super.triggerTypeField(context);
    }
    visitTypeAfter(context) {
        const { type  } = context;
        const receiver = type.name.substring(0, 1).toLowerCase();
        this.write(`}\n\n`);
        let writeTypeInfo = context.config.writeTypeInfo;
        if (writeTypeInfo == undefined) {
            writeTypeInfo = this.writeTypeInfo;
        }
        if (writeTypeInfo) {
            this.write(`func (${receiver} *${type.name}) Type() string {
        return "${type.name}"
      }\n\n`);
        }
        super.triggerTypeAfter(context);
    }
}
class FiberVisitor extends BaseVisitor {
    visitNamespaceBefore(context) {
        const packageName = context.config.package || "module";
        this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.

package ${packageName}

import (
  "github.com/gofiber/fiber/v2"\n`);
        const importsVisitor = new ImportsVisitor(this.writer);
        context.namespace.accept(context, importsVisitor);
        this.write(`
  "github.com/apexlang/api-go/transport/tfiber"
  "github.com/apexlang/api-go/transport/httpresponse"
)

const _ = httpresponse.Package
\n\n`);
        super.triggerNamespaceBefore(context);
    }
    visitInterfaceBefore(context) {
        if (!isService(context)) {
            return;
        }
        const { interface: iface  } = context;
        const visitor = new FiberServiceVisitor(this.writer);
        iface.accept(context, visitor);
    }
}
class FiberServiceVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        const { interface: iface  } = context;
        this.write(`func ${iface.name}Fiber(service ${iface.name}) tfiber.RegisterFn {
    return func(router fiber.Router) {\n`);
    }
    visitOperation(context) {
        const { interface: iface , operation  } = context;
        const path = getPath(context);
        if (path == "") {
            return;
        }
        const fiberPath = path.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, ":$1");
        const methods = getMethods(operation).map((m)=>capitalize(m.toLowerCase()));
        const translate = translateAlias(context);
        methods.forEach((method)=>{
            let paramType;
            this.write(`router.${method}("${fiberPath}", func(c *fiber.Ctx) error {
          resp := httpresponse.New()
			    ctx := httpresponse.NewContext(c.Context(), resp)\n`);
            if (operation.isUnary()) {
                paramType = operation.parameters[0].type;
            } else if (operation.parameters.length > 0) {
                const argsType = convertOperationToType(context.getType.bind(context), iface, operation);
                paramType = argsType;
                const structVisitor = new StructVisitor(this.writer);
                argsType.accept(context.clone({
                    type: argsType
                }), structVisitor);
            }
            const operMethod = methodName(operation, operation.name);
            if (paramType) {
                this.write(`var args ${expandType1(paramType, undefined, false, translate)}\n`);
                if (hasBody(method)) {
                    this.write(`if err := c.BodyParser(&args); err != nil {
            return err
          }\n`);
                }
                switch(paramType.kind){
                    case Kind.Type:
                        const t = paramType;
                        t.fields.forEach((f)=>{
                            if (path.indexOf(`{${f.name}}`) != -1) {
                                this.write(`args.${fieldName(f, f.name)} = c.Params("${f.name}")\n`);
                            } else if (f.annotation("query") != undefined) {
                                this.write(`args.${fieldName(f, f.name)} = c.Query("${f.name}")\n`);
                            }
                        });
                        break;
                }
                if (operation.type.kind != Kind.Void) {
                    this.write(`result, `);
                }
                if (operation.isUnary()) {
                    const pt = unwrapKinds(paramType, Kind.Alias);
                    const share = isKinds(pt, Kind.Primitive, Kind.Enum) ? "" : "&";
                    this.write(`err := service.${operMethod}(ctx, ${share}args)\n`);
                } else {
                    const args = paramType.fields.map((f)=>`, ${isObject(f.type, false) ? "&" : ""}args.${fieldName(f, f.name)}`).join("");
                    this.write(`err := service.${operMethod}(ctx${args})\n`);
                }
            } else {
                this.write(`err := service.${operMethod}(ctx)\n`);
            }
            if (operation.type.kind != Kind.Void) {
                this.write(`return tfiber.Response(c, resp, result, err)\n`);
            } else {
                this.write(`return err\n`);
            }
            this.write(`})\n`);
        });
    }
    visitInterfaceAfter(context) {
        this.write(`  }
}\n`);
    }
}
class ImportsVisitor extends BaseVisitor {
    imports = {};
    externalImports = {};
    visitNamespaceAfter(context) {
        const stdLib = [];
        for(const key in this.imports){
            const i = this.imports[key];
            if (i.import) {
                stdLib.push(i.import);
            }
        }
        stdLib.sort();
        for (const lib of stdLib){
            this.write(`\t"${lib}"\n`);
        }
        const thirdPartyLib = [];
        for(const key1 in this.externalImports){
            const i1 = this.externalImports[key1];
            if (i1.import) {
                thirdPartyLib.push(i1.import);
            }
        }
        thirdPartyLib.sort();
        if (thirdPartyLib.length > 0) {
            this.write(`\n`);
        }
        for (const lib1 of thirdPartyLib){
            this.write(`\t"${lib1}"\n`);
        }
    }
    addType(name, i) {
        if (i == undefined || i.import == undefined) {
            return;
        }
        if (i.import.indexOf(".") != -1) {
            if (this.externalImports[name] === undefined) {
                this.externalImports[name] = i;
            }
        } else {
            if (this.imports[name] === undefined) {
                this.imports[name] = i;
            }
        }
    }
    checkType(context, type) {
        const aliases = context.config.aliases || {};
        switch(type.kind){
            case Kind.Alias:
                {
                    const a = type;
                    const i = aliases[a.name];
                    this.addType(a.name, i);
                    break;
                }
            case Kind.Primitive:
                const prim = type;
                switch(prim.name){
                    case PrimitiveName.DateTime:
                        this.addType("Time", {
                            type: "time.Time",
                            import: "time"
                        });
                        break;
                }
                break;
            case Kind.Type:
                const named = type;
                const i1 = aliases[named.name];
                if (named.name === "datetime" && i1 == undefined) {
                    this.addType("Time", {
                        type: "time.Time",
                        import: "time"
                    });
                    return;
                }
                this.addType(named.name, i1);
                break;
            case Kind.List:
                const list = type;
                this.checkType(context, list.type);
                break;
            case Kind.Map:
                const map = type;
                this.checkType(context, map.keyType);
                this.checkType(context, map.valueType);
                break;
            case Kind.Optional:
                const optional = type;
                this.checkType(context, optional.type);
                break;
            case Kind.Enum:
                break;
        }
    }
    visitParameter(context) {
        this.checkType(context, context.parameter.type);
    }
    visitOperation(context) {
        this.checkType(context, context.operation.type);
    }
}
class GRPCVisitor extends BaseVisitor {
    input = {};
    output = {};
    aliases = {};
    visitNamespaceBefore(context) {
        this.aliases = context.config.aliases || {};
        const ns = context.namespace;
        const visitor = new InputOutputVisitor(this.writer, this.aliases);
        ns.accept(context, visitor);
        this.input = visitor.input;
        this.output = visitor.output;
        const packageName = context.config.package || "module";
        const module1 = context.config.module;
        const protoPackage = context.config.protoPackage || module1 + "/proto";
        this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.

package ${packageName}

import (
  "context"

  "google.golang.org/grpc"\n`);
        visitor.imports.forEach((i)=>this.write(`"${i}"\n`));
        this.write(`
  "github.com/apexlang/api-go/convert"
  "github.com/apexlang/api-go/errorz"
  "github.com/apexlang/api-go/transport/tgrpc"

	pb "${protoPackage}"
)

const (
	_ = convert.Package
	_ = errorz.Package
)\n\n`);
        super.triggerNamespaceBefore(context);
    }
    visitInterfaceBefore(context) {
        if (!isService(context)) {
            return;
        }
        const { interface: iface  } = context;
        this.write(`func ${iface.name}GRPC(s ${iface.name}) tgrpc.RegisterFn {
  return func(server grpc.ServiceRegistrar) {
    pb.Register${iface.name}Server(server, New${iface.name}GRPCWrapper(s))
  }
}

type ${iface.name}GRPCWrapper struct {
  pb.Unimplemented${iface.name}Server
  service ${iface.name}
}

func New${iface.name}GRPCWrapper(service ${iface.name}) *${iface.name}GRPCWrapper {
  return &${iface.name}GRPCWrapper{
    service: service,
  }
}\n\n`);
    }
    visitOperation(context) {
        if (!isService(context)) {
            return;
        }
        const { interface: iface , operation  } = context;
        const returnType = operation.type;
        const operName = capitalize(operation.name);
        this.write(`func (s *${iface.name}GRPCWrapper) ${operName}(ctx context.Context, `);
        if (operation.isUnary()) {
            const param = operation.parameters[0];
            const pt = unwrapKinds(param.type, Kind.Alias, Kind.Optional);
            switch(pt.kind){
                case Kind.Void:
                    this.write(`*emptypb.Empty`);
                    break;
                case Kind.Primitive:
                    const p = pt;
                    this.write(`${param.name} ${primitiveWrapperType(p.name)}`);
                    break;
                case Kind.Enum:
                    const e = pt;
                    this.write(`${param.name} *pb.${e.name}Value`);
                    break;
                case Kind.Type:
                    this.write(`request *pb.${pt.name}`);
                    break;
                default:
                    throw new Error(`unhandled type ${pt.kind}`);
            }
        } else if (operation.parameters.length > 0) {
            this.write(`args *pb.${operationArgsType(iface, operation)}`);
        } else {
            this.write(`_ *emptypb.Empty`);
        }
        this.write(`) (`);
        const rt = unwrapKinds(returnType, Kind.Alias, Kind.Optional);
        switch(rt.kind){
            case Kind.Void:
                this.write(`*emptypb.Empty`);
                break;
            case Kind.Primitive:
                const p1 = rt;
                this.write(primitiveWrapperType(p1.name));
                break;
            case Kind.Enum:
                this.write(`*pb.${rt.name}Value`);
                break;
            case Kind.Union:
            case Kind.Type:
                this.write(`*pb.${rt.name}`);
                break;
            default:
                throw new Error(`unhandled type ${rt.kind}`);
        }
        this.write(`, error) {\n`);
        if (operation.isUnary()) {
            const param1 = operation.parameters[0];
            let pt1 = param1.type;
            switch(pt1.kind){
                case Kind.Alias:
                    const a = pt1;
                    const imp = this.aliases[a.name];
                    if (imp && imp.parse) {
                        this.write(`input, err := ${imp.parse}(${param1.name}.Value)
            if err != nil {
              return nil, tgrpc.Error(errorz.Newf(errorz.InvalidArgument, "Invalid argument for ${param1.name}"))
            }\n`);
                        break;
                    }
                    pt1 = a.type;
                case Kind.Primitive:
                    const p2 = pt1;
                    switch(p2.name){
                        case PrimitiveName.I8:
                            this.write(`input := int8(${param1.name}.Value)\n`);
                            break;
                        case PrimitiveName.I16:
                            this.write(`input := int16(${param1.name}.Value)\n`);
                            break;
                        case PrimitiveName.U8:
                            this.write(`input := uint8(${param1.name}.Value)\n`);
                            break;
                        case PrimitiveName.U16:
                            this.write(`input := uint16(${param1.name}.Value)\n`);
                            break;
                        default:
                            this.write(`input := ${param1.name}.Value\n`);
                            break;
                    }
                    break;
                case Kind.Enum:
                    const e1 = pt1;
                    this.write(`input := ${e1.name}(${param1.name}.Value)\n`);
                    break;
                default:
                    this.write(`input, err := convertInput${param1.type.name}(request)
            if err != nil {
              return nil, tgrpc.Error(err)
            }\n`);
                    break;
            }
            if (!isVoid(operation.type)) {
                this.write(`result, `);
            }
            this.write(`err := s.service.${methodName(operation, operation.name)}(ctx, ${isObject(pt1) ? "" : ""}input)
      if err != nil {
      	return nil, tgrpc.Error(err)
      }\n`);
        } else {
            let params = "";
            if (operation.parameters.length > 0) {
                const argsType = convertOperationToType(context.getType.bind(context), iface, operation);
                const structVisitor = new StructVisitor(this.writer);
                argsType.accept(context.clone({
                    type: argsType
                }), structVisitor);
                this.write(`var et errorz.Tracker
      input := ${argsType.name}{\n`);
                argsType.fields.forEach((f)=>{
                    this.write(`${fieldName(f, f.name)}: ${this.writeInput(f, "args", false)},\n`);
                });
                this.write(`}
      if errz := et.Errors(); errz != nil {
        return nil, tgrpc.Error(errz)
      }\n`);
                params = argsType.fields.map((f)=>`, ${returnShare(f.type)}input.${fieldName(f, f.name)}`).join("");
            }
            if (!isVoid(operation.type)) {
                this.write(`result, `);
            }
            this.write(`err := s.service.${methodName(operation, operation.name)}(ctx${params})
      if err != nil {
      	return nil, tgrpc.Error(err)
      }\n`);
        }
        let rt2 = operation.type;
        let format = "";
        switch(rt2.kind){
            case Kind.Void:
                this.write(`return &emptypb.Empty{}, nil\n`);
                break;
            case Kind.Union:
            case Kind.Type:
                this.write(`return convertOutput${rt2.name}(result), nil\n`);
                break;
            case Kind.Enum:
                const e2 = rt2;
                this.write(`return &pb.${e2.name}Value{Value: pb.${e2.name}(result)}, nil\n`);
                break;
            case Kind.Alias:
                const a1 = rt2;
                const imp1 = this.aliases[a1.name];
                if (imp1) {
                    format = "." + (imp1.format || `${pascalCase(expandType1(a1.type))}`) + `()`;
                }
                rt2 = a1.type;
            case Kind.Primitive:
                const p3 = rt2;
                switch(p3.name){
                    case PrimitiveName.String:
                        this.write(`return &wrapperspb.StringValue{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.I64:
                        this.write(`return &wrapperspb.Int64Value{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.I32:
                        this.write(`return &wrapperspb.Int32Value{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.I16:
                    case PrimitiveName.I8:
                        this.write(`return &wrapperspb.Int32Value{Value: int32(result${format})}, nil\n`);
                        break;
                    case PrimitiveName.U64:
                        this.write(`return &wrapperspb.UInt64Value{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.U32:
                        this.write(`return &wrapperspb.UInt32Value{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.U16:
                    case PrimitiveName.U8:
                        this.write(`return &wrapperspb.UInt32Value{Value: uint32(result${format})}, nil\n`);
                        break;
                    case PrimitiveName.F64:
                        this.write(`return &wrapperspb.DoubleValue{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.F32:
                        this.write(`return &wrapperspb.FloatValue{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.Bool:
                        this.write(`return &wrapperspb.BoolValue{Value: result${format}}, nil\n`);
                        break;
                    case PrimitiveName.Bytes:
                        this.write(`return &wrapperspb.BytesValue{Value: result${format}}, nil\n`);
                        break;
                }
        }
        this.write(`}\n\n`);
    }
    visitNamespaceAfter(context) {
        for (let name of Object.keys(this.input)){
            const named = this.input[name];
            switch(named.kind){
                case Kind.Type:
                    const t = named;
                    this.writeInputType(t);
                    break;
                case Kind.Union:
                    const u = named;
                    this.writeInputUnion(u);
                    break;
            }
        }
        for (let name1 of Object.keys(this.output)){
            const named1 = this.output[name1];
            switch(named1.kind){
                case Kind.Type:
                    const t1 = named1;
                    this.writeOutputType(t1);
                    break;
                case Kind.Union:
                    const u1 = named1;
                    this.writeOutputUnion(u1);
                    break;
            }
        }
    }
    writeOutputType(t) {
        this.write(`func convertOutput${t.name}(from *${t.name}) *pb.${t.name} {
      if from == nil {
        return nil
      }
      return &pb.${t.name}{\n`);
        t.fields.forEach((f)=>{
            let ft = f.type;
            switch(ft.kind){
                case Kind.Optional:
                    let optType = ft.type;
                    switch(optType.kind){
                        case Kind.Primitive:
                            const prim = optType;
                            let wrapperStart = "";
                            let wrapperEnd = "";
                            switch(prim.name){
                                case PrimitiveName.I16:
                                    wrapperStart = `tgrpc.ConvertOutputI16Ptr(`;
                                    wrapperEnd = ")";
                                    break;
                                case PrimitiveName.I8:
                                    wrapperStart = `tgrpc.ConvertOutputI8Ptr(`;
                                    wrapperEnd = ")";
                                    break;
                                case PrimitiveName.U16:
                                    wrapperStart = `tgrpc.ConvertOutputU16Ptr(`;
                                    wrapperEnd = ")";
                                    break;
                                case PrimitiveName.U8:
                                    wrapperStart = `tgrpc.ConvertOutputU8Ptr(`;
                                    wrapperEnd = ")";
                                    break;
                                case PrimitiveName.DateTime:
                                    wrapperStart = `tgrpc.ConvertOutputTimestamp(`;
                                    wrapperEnd = `)`;
                                    break;
                            }
                            this.write(`${capitalize(f.name)}: ${wrapperStart}from.${fieldName(f, f.name)}${wrapperEnd},\n`);
                            break;
                        case Kind.Alias:
                            const a = optType;
                            const imp = this.aliases[a.name];
                            if (imp) {
                                this.write(`${capitalize(f.name)}: convert.Nillable(from.${fieldName(f, f.name)}, func(value ${imp.type}) ${expandType1(a.type)} {
                  return value.${imp.format || "String"}()
                }),\n`);
                            } else {}
                            break;
                        case Kind.Enum:
                            const e = optType;
                            this.write(`${capitalize(f.name)}: (*pb.${e.name})(from.${fieldName(f, f.name)}),\n`);
                            break;
                        case Kind.Union:
                        case Kind.Type:
                            const ft1 = optType;
                            this.write(`${capitalize(f.name)}: convertOutput${ft1.name}(from.${fieldName(f, f.name)}),\n`);
                            break;
                    }
                    break;
                case Kind.Alias:
                    const a1 = ft;
                    const imp1 = this.aliases[a1.name];
                    if (imp1) {
                        this.write(`${capitalize(f.name)}: from.${capitalize(f.name)}.${imp1.format || "String"}(),\n`);
                        break;
                    }
                    ft = a1.type;
                case Kind.Primitive:
                    const prim1 = ft;
                    let wrapperStart1 = "";
                    let wrapperEnd1 = "";
                    switch(prim1.name){
                        case PrimitiveName.I16:
                        case PrimitiveName.I8:
                            wrapperStart1 = `int32(`;
                            wrapperEnd1 = ")";
                            break;
                        case PrimitiveName.U16:
                        case PrimitiveName.U8:
                            wrapperStart1 = `uint32(`;
                            wrapperEnd1 = ")";
                            break;
                        case PrimitiveName.DateTime:
                            wrapperStart1 = `timestamppb.New(`;
                            wrapperEnd1 = `)`;
                            break;
                    }
                    this.write(`${capitalize(f.name)}: ${wrapperStart1}from.${fieldName(f, f.name)}${wrapperEnd1},\n`);
                    break;
                case Kind.Enum:
                    const e1 = ft;
                    this.write(`${capitalize(f.name)}: pb.${e1.name}(from.${fieldName(f, f.name)}),\n`);
                    break;
                case Kind.Union:
                case Kind.Type:
                    const named = ft;
                    const ref = named.name == t.name ? "" : "&";
                    this.write(`${capitalize(f.name)}: convertOutput${named.name}(${ref}from.${fieldName(f, f.name)}),\n`);
                    break;
                case Kind.Map:
                    const m = ft;
                    if (isObject(m.valueType)) {
                        const n = m.valueType.kind == Kind.Optional ? m.valueType.type : m.valueType;
                        const ptr = m.valueType.kind == Kind.Optional ? "" : "Ptr";
                        this.write(`${capitalize(f.name)}: convert.Map${ptr}(from.${fieldName(f, f.name)}, convertOutput${n.name}),\n`);
                    } else {
                        this.write(`${capitalize(f.name)}: from.${fieldName(f, f.name)},\n`);
                    }
                    break;
                case Kind.List:
                    const l = ft;
                    if (isObject(l.type)) {
                        const n1 = unwrapKinds(l.type, Kind.Optional);
                        const ptr1 = l.type.kind == Kind.Optional ? "" : "Ptr";
                        this.write(`${capitalize(f.name)}: convert.Slice${ptr1}(from.${fieldName(f, f.name)}, convertOutput${n1.name}),\n`);
                    } else {
                        this.write(`${capitalize(f.name)}: from.${fieldName(f, f.name)},\n`);
                    }
                    break;
            }
        });
        this.write(`\t}
  }\n\n`);
    }
    writeOutputUnion(union) {
        this.write(`func convertOutput${union.name}(from *${union.name}) *pb.${union.name} {
      if from == nil {
        return nil
      }
      switch {\n`);
        union.types.forEach((ut)=>{
            this.write(`case from.${pascalCase(expandType1(ut))} != nil:
            return &pb.${union.name}{\n`);
            switch(ut.kind){
                case Kind.Union:
                case Kind.Type:
                    const t = ut;
                    this.write(`Value: &pb.${union.name}_${t.name}Value{\n`);
                    this.write(`${t.name}Value: convertOutput${t.name}(from.${t.name}),\n`);
                    this.write(`},\n`);
                    break;
                case Kind.Enum:
                    const e = ut;
                    this.write(`Value: &pb.${union.name}_${e.name}Value{\n`);
                    this.write(`${e.name}Value: pb.${e.name}(*from.${e.name}),\n`);
                    this.write(`},\n`);
                    break;
                case Kind.Primitive:
                    const p = ut;
                    this.write(`Value: &pb.${union.name}_${pascalCase(p.name)}Value{\n`);
                    this.write(`${pascalCase(p.name)}Value: *from.${pascalCase(p.name)},\n`);
                    this.write(`},\n`);
                    break;
            }
            this.write(`}\n`);
        });
        this.write(`}
    return nil
    }\n\n`);
    }
    writeInputType(t) {
        this.write(`func convertInput${t.name}(from *pb.${t.name}) (*${t.name}, error) {
      if from == nil {
        return nil, nil
      }
      var et errorz.Tracker

      result := ${t.name}{\n`);
        t: t.fields.forEach((f)=>`${this.writeInputField(f)}`);
        this.write(`\t}
    if errz := et.Errors(); errz != nil {
      return nil, errz
    }

    return &result, nil
  }\n\n`);
    }
    writeInput(f, from, allowPtr) {
        let t = f.type;
        switch(t.kind){
            case Kind.Optional:
                let optType = unwrapKinds(t, Kind.Optional);
                switch(optType.kind){
                    case Kind.Alias:
                        const a = optType;
                        const imp = this.aliases[a.name];
                        if (imp) {
                            return `convert.NillableEt(&et, ${from}.${capitalize(f.name)}, ${imp.parse || "Parse"})`;
                        }
                        optType = a.type;
                    case Kind.Primitive:
                        const prim = optType;
                        let wrapperStart = "";
                        let wrapperEnd = "";
                        switch(prim.name){
                            case PrimitiveName.I16:
                                wrapperStart = `tgrpc.ConvertInputI16Ptr(`;
                                wrapperEnd = ")";
                                break;
                            case PrimitiveName.I8:
                                wrapperStart = `tgrpc.ConvertInputI8Ptr(`;
                                wrapperEnd = ")";
                                break;
                            case PrimitiveName.U16:
                                wrapperStart = `tgrpc.ConvertInputU16Ptr(`;
                                wrapperEnd = ")";
                                break;
                            case PrimitiveName.U8:
                                wrapperStart = `tgrpc.ConvertInputU8Ptr(`;
                                wrapperEnd = ")";
                                break;
                            case PrimitiveName.DateTime:
                                wrapperStart = `tgrpc.ConvertInputTimestamp(`;
                                wrapperEnd = `)`;
                                break;
                        }
                        return `${wrapperStart}${from}.${capitalize(f.name)}${wrapperEnd}`;
                    case Kind.Enum:
                        const e = optType;
                        return `(*${e.name})(${from}.${capitalize(f.name)})`;
                    case Kind.Union:
                    case Kind.Type:
                        const ft = optType;
                        return `errorz.Track(&et, convertInput${ft.name}, ${from}.${capitalize(f.name)})`;
                }
                throw new Error(`unhandled type ${optType.kind} inside optional`);
            case Kind.Alias:
                const a1 = t;
                const imp1 = this.aliases[a1.name];
                if (imp1) {
                    return `errorz.Track(&et, ${imp1.parse || "Parse"}, ${from}.${capitalize(f.name)})`;
                }
                t = a1.type;
            case Kind.Primitive:
                const prim1 = t;
                let wrapperStart1 = "";
                let wrapperEnd1 = "";
                switch(prim1.name){
                    case PrimitiveName.I16:
                        wrapperStart1 = `int16(`;
                        wrapperEnd1 = ")";
                        break;
                    case PrimitiveName.I8:
                        wrapperStart1 = `int8(`;
                        wrapperEnd1 = ")";
                        break;
                    case PrimitiveName.U16:
                        wrapperStart1 = `uint16(`;
                        wrapperEnd1 = ")";
                        break;
                    case PrimitiveName.U8:
                        wrapperStart1 = `uint8(`;
                        wrapperEnd1 = ")";
                        break;
                    case PrimitiveName.DateTime:
                        wrapperEnd1 = `.AsTime()`;
                        break;
                }
                return `${wrapperStart1}${from}.${capitalize(f.name)}${wrapperEnd1}`;
            case Kind.Enum:
                const e1 = t;
                return `${e1.name}(${from}.${fieldName(f, f.name)})`;
            case Kind.Union:
            case Kind.Type:
                const ft1 = t;
                const ptr = allowPtr ? "" : "*";
                return `${ptr}errorz.Track(&et, convertInput${ft1.name}, ${from}.${fieldName(f, f.name)})`;
            case Kind.Map:
                const m = t;
                if (isObject(m.valueType)) {
                    const n = m.valueType;
                    return `convert.MapRefEt(&et, ${from}.${capitalize(f.name)}, convertInput${n.name})`;
                } else {
                    return `${from}.${capitalize(f.name)}`;
                }
            case Kind.List:
                const l = t;
                if (isObject(l.type)) {
                    const n1 = l.type;
                    return `convert.SliceRefEt(&et, ${from}.${capitalize(f.name)}, convertInput${n1.name})`;
                } else {
                    return `${from}.${capitalize(f.name)}`;
                }
        }
        throw new Error(`unhandled type ${f.type.kind}`);
    }
    writeInputField(f) {
        this.write(`${fieldName(f, f.name)}: ${this.writeInput(f, "from", false)},\n`);
    }
    writeInputUnion(union) {
        this.write(`func convertInput${union.name}(from *pb.${union.name}) (*${union.name}, error) {
      if from == nil {
        return nil, nil
      }
      switch v := from.Value.(type) {\n`);
        union.types.forEach((ut)=>{
            if (ut.kind == Kind.Type) {
                const t = ut;
                this.write(`case *pb.${union.name}_${pascalCase(expandType1(ut))}Value:
          v${t.name}Value, err := convertInput${t.name}(v.${t.name}Value)
          return &${union.name}{
            ${t.name}: v${t.name}Value,
          }, err\n`);
            } else {
                this.write(`case *pb.${union.name}_${pascalCase(expandType1(ut))}Value:
          return &${union.name}{\n`);
                switch(ut.kind){
                    case Kind.Union:
                        const t1 = ut;
                        this.write(`${t1.name}: convertInput${t1.name}(v.${t1.name}Value),\n`);
                        break;
                    case Kind.Enum:
                        const e = ut;
                        this.write(`${e.name}: convert.Ptr(${e.name}(v.${e.name}Value)),\n`);
                        break;
                    case Kind.Primitive:
                        const p = ut;
                        this.write(`${pascalCase(p.name)}: &v.${pascalCase(p.name)}Value,\n`);
                        break;
                }
                this.write(`}, nil\n`);
            }
        });
        this.write(`\t}
    return nil, nil
  }\n\n`);
    }
}
class InputOutputVisitor extends BaseVisitor {
    imports = new Set();
    input = {};
    output = {};
    aliases = {};
    constructor(writer, aliases){
        super(writer);
        this.aliases = aliases;
    }
    visitOperation(context) {
        if (!isService(context)) {
            return;
        }
        const { operation  } = context;
        if (isVoid(operation.type) || operation.parameters.length == 0) {
            this.imports.add("google.golang.org/protobuf/types/known/emptypb");
        }
        if (operation.isUnary()) {
            this.checkSingleType(operation.parameters[0].type);
        }
        this.checkSingleType(operation.type);
        this.checkType(context, operation.type, this.output);
    }
    visitParameter(context) {
        if (!isService(context)) {
            return;
        }
        const { parameter  } = context;
        this.checkType(context, parameter.type, this.input);
    }
    checkSingleType(a) {
        if (isPrimitive(a)) {
            const p = a;
            if (p.name == PrimitiveName.DateTime) {
                this.imports.add("google.golang.org/protobuf/types/known/timestamppb");
            } else {
                this.imports.add("google.golang.org/protobuf/types/known/wrapperspb");
            }
        }
    }
    checkType(context, a, m, types = new Set()) {
        if (isNamed(a)) {
            const n = a;
            if (types.has(n.name)) {
                return;
            }
            types.add(n.name);
        }
        switch(a.kind){
            case Kind.Primitive:
                const p = a;
                if (p.name == PrimitiveName.DateTime) {
                    this.imports.add("google.golang.org/protobuf/types/known/timestamppb");
                }
                break;
            case Kind.Type:
                const t = a;
                m[t.name] = t;
                t.fields.forEach((f)=>this.checkType(context, f.type, m, types));
                break;
            case Kind.Union:
                const u = a;
                m[u.name] = u;
                u.types.forEach((t)=>this.checkType(context, t, m, types));
                break;
            case Kind.Alias:
                const al = a;
                const imp = this.aliases[al.name];
                if (imp && imp.import) {
                    this.imports.add(imp.import);
                }
                m[al.name] = al;
                this.checkType(context, al.type, m, types);
                break;
            case Kind.Map:
                const ma = a;
                this.checkType(context, ma.keyType, m, types);
                this.checkType(context, ma.valueType, m, types);
                break;
            case Kind.List:
                const l = a;
                this.checkType(context, l.type, m, types);
                break;
            case Kind.Optional:
                const o = a;
                this.checkType(context, o.type, m, types);
                break;
        }
    }
}
function primitiveWrapperType(name) {
    switch(name){
        case PrimitiveName.String:
            return `*wrapperspb.StringValue`;
        case PrimitiveName.I64:
            return `*wrapperspb.Int64Value`;
        case PrimitiveName.I32:
        case PrimitiveName.I16:
        case PrimitiveName.I8:
            return `*wrapperspb.Int32Value`;
        case PrimitiveName.U64:
            return `*wrapperspb.UInt64Value`;
        case PrimitiveName.U32:
        case PrimitiveName.U16:
        case PrimitiveName.U8:
            return `*wrapperspb.UInt32Value`;
        case PrimitiveName.F64:
            return `*wrapperspb.DoubleValue`;
        case PrimitiveName.F32:
            return `*wrapperspb.FloatValue`;
        case PrimitiveName.Bool:
            return `*wrapperspb.BoolValue`;
        case PrimitiveName.Bytes:
            return `*wrapperspb.BytesValue`;
    }
    return "unknown";
}
class ImportsVisitor1 extends BaseVisitor {
    imports = {};
    externalImports = {};
    visitNamespaceAfter(context) {
        const stdLib = [];
        for(const key in this.imports){
            const i = this.imports[key];
            if (i.import) {
                stdLib.push(i.import);
            }
        }
        stdLib.sort();
        const thirdPartyLib = [];
        for(const key1 in this.externalImports){
            const i1 = this.externalImports[key1];
            if (i1.import) {
                thirdPartyLib.push(i1.import);
            }
        }
        thirdPartyLib.sort();
        if (stdLib.length > 0 || thirdPartyLib.length > 0) {
            this.write(`import (\n`);
            for (const lib of stdLib){
                this.write(`\t"${lib}"\n`);
            }
            if (thirdPartyLib.length > 0) {
                this.write(`\n`);
            }
            for (const lib1 of thirdPartyLib){
                this.write(`\t"${lib1}"\n`);
            }
            this.write(`)\n`);
        }
    }
    addType(name, i) {
        if (i == undefined || i.import == undefined) {
            return;
        }
        if (i.import.indexOf(".") != -1) {
            if (this.externalImports[name] === undefined) {
                this.externalImports[name] = i;
            }
        } else {
            if (this.imports[name] === undefined) {
                this.imports[name] = i;
            }
        }
    }
    checkType(context, type) {
        const aliases = context.config.aliases || {};
        switch(type.kind){
            case Kind.Stream:
                const s = type;
                this.checkType(context, s.type);
                break;
            case Kind.Alias:
                {
                    const a = type;
                    const i = aliases[a.name];
                    this.addType(a.name, i);
                    break;
                }
            case Kind.Primitive:
                const prim = type;
                switch(prim.name){
                    case PrimitiveName.DateTime:
                        this.addType("Time", {
                            type: "time.Time",
                            import: "time"
                        });
                        break;
                }
                break;
            case Kind.Type:
                const named = type;
                const i1 = aliases[named.name];
                if (named.name === "datetime" && i1 == undefined) {
                    this.addType("Time", {
                        type: "time.Time",
                        import: "time"
                    });
                    return;
                }
                this.addType(named.name, i1);
                break;
            case Kind.List:
                const list = type;
                this.checkType(context, list.type);
                break;
            case Kind.Map:
                const map = type;
                this.checkType(context, map.keyType);
                this.checkType(context, map.valueType);
                break;
            case Kind.Optional:
                const optional = type;
                this.checkType(context, optional.type);
                break;
            case Kind.Enum:
                const jsonSupport = context.config.noEnumJSON ? !context.config.noEnumJSON : true;
                if (jsonSupport) {
                    this.addType("JSON", {
                        type: "JSON",
                        import: "encoding/json"
                    });
                    this.addType("FMT", {
                        type: "FMT",
                        import: "fmt"
                    });
                }
                break;
        }
    }
    visitParameter(context) {
        this.checkType(context, context.parameter.type);
    }
    visitFunction(context) {
        this.addType("context", {
            type: "context.Context",
            import: "context"
        });
        this.checkType(context, context.operation.type);
    }
    visitOperation(context) {
        this.addType("context", {
            type: "context.Context",
            import: "context"
        });
        this.checkType(context, context.operation.type);
    }
    visitTypeField(context) {
        this.checkType(context, context.field.type);
    }
}
class InterfaceVisitor1 extends BaseVisitor {
    visitInterfaceBefore(context) {
        const { interface: iface  } = context;
        this.write(formatComment("// ", iface.description));
        this.write(`type ${iface.name} interface {\n`);
    }
    visitFunction(context) {
        const { operation  } = context;
        if (noCode(operation)) {
            return;
        }
        this.write(formatComment("// ", operation.description));
        this.write(`type ${methodName(operation, operation.name)}Fn func(ctx context.Context`);
        operation.parameters.forEach((p)=>this.visitParam(context.clone({
                parameter: p
            })));
        this.write(`)`);
        this.visitOperationReturn(context);
        this.write(`\n\n`);
    }
    visitOperation(context) {
        const { operation  } = context;
        if (noCode(operation)) {
            return;
        }
        this.write(formatComment("// ", operation.description));
        this.write(`${methodName(operation, operation.name)}(ctx context.Context`);
        operation.parameters.forEach((p)=>this.visitParam(context.clone({
                parameter: p
            })));
        this.write(`)`);
        this.visitOperationReturn(context);
        this.write(`\n`);
    }
    visitParam(context) {
        const { parameter  } = context;
        const translate = translateAlias(context);
        this.write(`, ${mapParam(context, parameter, undefined, translate)}`);
    }
    visitOperationReturn(context) {
        const { operation  } = context;
        const translate = translateAlias(context);
        if (!isVoid(operation.type)) {
            this.write(` (${returnPointer(operation.type)}${expandType1(operation.type, undefined, true, translate)}, error)`);
        } else {
            this.write(` error`);
        }
    }
    visitInterfaceAfter(context) {
        this.write(`}\n\n`);
    }
}
class UnionVisitor extends BaseVisitor {
    visitUnion(context) {
        const tick = "`";
        const { union  } = context;
        this.write(formatComment("// ", union.description));
        this.write(`type ${union.name} struct {\n`);
        union.types.forEach((t)=>{
            const tname = typeName(t);
            const expandedName = expandType1(t);
            this.write(`${fieldName(undefined, tname)} *${expandedName} ${tick}json:"${tname},omitempty" yaml:"${tname},omitempty" msgpack:"${tname},omitempty`);
            this.triggerCallbacks(context, "UnionStructTags");
            this.write(`"${tick}\n`);
        });
        this.write(`}\n\n`);
    }
}
class InterfacesVisitor extends BaseVisitor {
    importsVisitor = (writer)=>new ImportsVisitor1(writer);
    serviceVisitor = (writer)=>new InterfaceVisitor1(writer);
    dependencyVisitor = (writer)=>new InterfaceVisitor1(writer);
    structVisitor = (writer)=>new StructVisitor(writer, true);
    enumVisitor = (writer)=>new EnumVisitor1(writer);
    unionVisitor = (writer)=>new UnionVisitor(writer);
    aliasVisitor = (writer)=>new AliasVisitor(writer);
    visitNamespaceBefore(context) {
        const packageName = context.config.package || "module";
        this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.

    package ${packageName}
\n`);
        const visitor = this.importsVisitor(this.writer);
        const ns = context.namespace;
        ns.accept(context, visitor);
        this.write(`\n\n
      type ns struct{}

      func (n *ns) Namespace() string {
        return "${ns.name}"
      }\n\n`);
        ns.annotation("version", (a)=>{
            this.write(`func (n *ns) Version() string {
          return "${a.arguments[0].value.getValue()}"
        }\n\n`);
        });
        super.triggerNamespaceBefore(context);
    }
    visitFunctionBefore(context) {
        const { operation  } = context;
        const visitor = this.serviceVisitor(this.writer);
        operation.accept(context, visitor);
    }
    visitInterfaceBefore(context) {
        const { interface: iface  } = context;
        if (isProvider(context)) {
            const visitor = this.dependencyVisitor(this.writer);
            iface.accept(context, visitor);
        } else if (isHandler(context)) {
            const visitor1 = this.serviceVisitor(this.writer);
            iface.accept(context, visitor1);
        }
    }
    visitAlias(context) {
        const visitor = this.aliasVisitor(this.writer);
        context.alias.accept(context, visitor);
    }
    visitEnum(context) {
        const visitor = this.enumVisitor(this.writer);
        context.enum.accept(context, visitor);
    }
    visitUnion(context) {
        const visitor = this.unionVisitor(this.writer);
        context.union.accept(context, visitor);
    }
    visitType(context) {
        const visitor = this.structVisitor(this.writer);
        context.type.accept(context, visitor);
    }
}
class MainVisitor extends BaseVisitor {
    usesVisitor = (writer)=>new InterfaceUsesVisitor(writer);
    visitNamespaceBefore(context) {
        const config = context.config;
        const http = config.http || {};
        const grpc = config.grpc || {};
        if (http.enabled == undefined) {
            http.enabled = true;
        }
        http.defaultAddress = http.defaultAddress || ":3000";
        http.environmentKey = http.environmentKey || "HTTP_ADDRESS";
        if (grpc.enabled == undefined) {
            grpc.enabled = true;
        }
        grpc.defaultAddress = grpc.defaultAddress || ":4000";
        grpc.environmentKey = grpc.environmentKey || "GRPC_ADDRESS";
        config.package = config.package || "mypackage";
        config.module = config.module || "githib.com/myorg/mymodule";
        config.imports = config.imports || [];
        if (config.imports.length == 0) {
            config.imports.push(`${config.module}/pkg/${config.package}`);
        }
        const usesVisitor = this.usesVisitor(this.writer);
        context.namespace.accept(context, usesVisitor);
        this.write(`package main

import (
	"context"
	"errors"\n`);
        if (grpc.enabled) {
            this.write(`\t"net"\n`);
        }
        this.write(`\t"os"

	"github.com/go-logr/zapr"\n`);
        if (http.enabled) {
            this.write(`\t"github.com/gofiber/fiber/v2"\n`);
        }
        this.write(`\t"github.com/oklog/run"
	"go.uber.org/zap"\n`);
        if (grpc.enabled) {
            this.write(`\t"google.golang.org/grpc"\n`);
        }
        this.write(`\n`);
        if (http.enabled) {
            this.write(`\t"github.com/apexlang/api-go/transport/tfiber"\n`);
        }
        if (grpc.enabled) {
            this.write(`\t"github.com/apexlang/api-go/transport/tgrpc"\n`);
        }
        this.write(`\n`);
        config.imports.forEach((module1)=>this.write(`\t"${module1}"\n`));
        this.write(`\n)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize logger
	zapLog, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}
	log := zapr.NewLogger(zapLog)

  // Connect to data sources

  // Create dependencies\n`);
        usesVisitor.dependencies.forEach((dependency)=>{
            this.write(`${camelCase(dependency)}Dep := ${config.package}.New${dependency}(log)\n`);
        });
        this.write(`\n\n// Create service components\n`);
        usesVisitor.services.forEach((dependencies, service)=>{
            const deps = (dependencies.length > 0 ? ", " : "") + dependencies.map((d)=>camelCase(d) + "Dep").join(", ");
            this.write(`${camelCase(service)}Service := ${config.package}.New${service}(log${deps})\n`);
        });
        this.write(`\nvar g run.Group\n`);
        if (http.enabled) {
            this.write(`// REST/HTTP
    {
      // Fiber app config with custom error handler
      config := fiber.Config{
        DisableStartupMessage: true,
        ErrorHandler: tfiber.ErrorHandler,
      }
      app := fiber.New(config)\n`);
            usesVisitor.services.forEach((_, service)=>{
                this.write(`tfiber.Register(app, ${config.package}.${service}Fiber(${camelCase(service)}Service))\n`);
            });
            this.write(`listenAddr := getEnv("${http.environmentKey}", "${http.defaultAddress}")
      log.Info("HTTP server", "address", listenAddr)
      g.Add(func() error {
        return app.Listen(listenAddr)
      }, func(err error) {
        app.Shutdown()
      })
    }\n`);
        }
        if (grpc.enabled) {
            this.write(`// gRPC
	{
		server := grpc.NewServer()\n`);
            usesVisitor.services.forEach((_, service)=>{
                this.write(`tgrpc.Register(server, ${config.package}.${service}GRPC(${camelCase(service)}Service))\n`);
            });
            this.write(`listenAddr := getEnv("${grpc.environmentKey}", "${grpc.defaultAddress}")
    log.Info("gRPC server", "address", listenAddr)
		g.Add(func() error {
			ln, err := net.Listen("tcp", listenAddr)
			if err != nil {
				return err
			}
			return server.Serve(ln)
		}, func(err error) {
			server.GracefulStop()
		})
	}\n`);
        }
        this.write(`// Termination signals
	{
		g.Add(run.SignalHandler(ctx, os.Interrupt, os.Kill))
	}

	var se run.SignalError
	if err := g.Run(); err != nil && !errors.As(err, &se) {
		log.Error(err, "goroutine error")
		os.Exit(1)
	}
}

func getEnv(key string, defaultVal string) string {
	val, ok := os.LookupEnv(key)
	if !ok {
		val = defaultVal
	}
	return val
}
`);
    }
}
function getLogger(context) {
    return context.config.logger;
}
class ScaffoldVisitor1 extends BaseVisitor {
    visitNamespaceBefore(context) {
        const packageName = context.config.package || "myapp";
        super.visitNamespaceBefore(context);
        const logger = getLogger(context);
        const roleNames = context.config.names || [];
        const roleTypes = context.config.types || [];
        const hasInterfaces = Object.values(context.namespace.interfaces).find((iface)=>{
            const c = context.clone({
                interface: iface
            });
            return isOneOfType(c, roleTypes) || roleNames.indexOf(iface.name) != -1;
        }) != undefined;
        this.write(`package ${packageName}\n\n`);
        if (hasInterfaces) {
            this.write(`import (\n`);
            if (hasServiceCode(context)) {
                this.write(`\t"context"\n\n`);
            }
            const importsVisitor = new ImportsVisitor2(this.writer);
            context.namespace.accept(context, importsVisitor);
            if (logger) {
                this.write(`\t"${logger.import}"\n`);
            }
            this.write(`)\n\n`);
        }
        const service = new ServiceVisitor1(this.writer);
        context.namespace.accept(context, service);
    }
}
class ServiceVisitor1 extends BaseVisitor {
    visitInterfaceBefore(context) {
        const roleNames = context.config.names || [];
        const roleTypes = context.config.types || [];
        const { interface: iface  } = context;
        const logger = getLogger(context);
        if (!isOneOfType(context, roleTypes) && roleNames.indexOf(iface.name) == -1) {
            return;
        }
        let dependencies = [];
        iface.annotation("uses", (a)=>{
            if (a.arguments.length > 0) {
                dependencies = a.arguments[0].value.getValue();
            }
        });
        this.write(`
    type ${iface.name}Impl struct {\n`);
        if (logger) {
            this.write(`log ${logger.interface}\n`);
        }
        this.write(`${dependencies.map((e)=>camelCase(e) + " " + e).join("\n\t\t")}
    }

    func New${iface.name}(`);
        if (logger) {
            this.write(`log ${logger.interface}`);
            if (dependencies.length > 0) {
                this.write(`, `);
            }
        }
        this.write(`${dependencies.map((e)=>camelCase(e) + " " + e).join(", ")}) *${iface.name}Impl {
      return &${iface.name}Impl{\n`);
        if (logger) {
            this.write("log: log,\n");
        }
        this.write(`${dependencies.map((e)=>camelCase(e) + ": " + camelCase(e) + ",").join(",\n\t\t")}
      }
    }\n\n`);
    }
    visitOperation(context) {
        if (!isValid1(context)) {
            return;
        }
        const { operation , interface: iface  } = context;
        if (noCode(operation)) {
            return;
        }
        this.write(`\n`);
        this.write(`func (${receiver(iface)} *${iface.name}Impl) ${methodName(operation, operation.name)}(`);
        const translate = translateAlias(context);
        this.write(`${mapParams(context, operation.parameters, undefined, translate)})`);
        if (!isVoid(operation.type)) {
            this.write(` (${returnPointer(operation.type)}${expandType1(operation.type, undefined, true, translate)}, error)`);
        } else {
            this.write(` error`);
        }
        this.write(` {\n`);
        if (!isVoid(operation.type)) {
            const dv = defaultValueForType(context, operation.type, undefined);
            this.write(`  return ${returnShare(operation.type)}${dv}, nil`);
        } else {
            this.write(`  return nil`);
        }
        this.write(` // TODO: Provide implementation.\n`);
        this.write(`}\n`);
    }
}
class ImportsVisitor2 extends BaseVisitor {
    imports = {};
    externalImports = {};
    visitNamespaceAfter(context) {
        const stdLib = [];
        for(const key in this.imports){
            const i = this.imports[key];
            if (i.import) {
                stdLib.push(i.import);
            }
        }
        stdLib.sort();
        for (const lib of stdLib){
            this.write(`\t"${lib}"\n`);
        }
        const thirdPartyLib = [];
        for(const key1 in this.externalImports){
            const i1 = this.externalImports[key1];
            if (i1.import) {
                thirdPartyLib.push(i1.import);
            }
        }
        thirdPartyLib.sort();
        if (thirdPartyLib.length > 0) {
            this.write(`\n`);
        }
        for (const lib1 of thirdPartyLib){
            this.write(`\t"${lib1}"\n`);
        }
    }
    addType(name, i) {
        if (i == undefined || i.import == undefined) {
            return;
        }
        if (i.import.indexOf(".") != -1) {
            if (this.externalImports[name] === undefined) {
                this.externalImports[name] = i;
            }
        } else {
            if (this.imports[name] === undefined) {
                this.imports[name] = i;
            }
        }
    }
    checkType(context, type) {
        const aliases = context.config.aliases || {};
        switch(type.kind){
            case Kind.Alias:
                {
                    const a = type;
                    const i = aliases[a.name];
                    this.addType(a.name, i);
                    break;
                }
            case Kind.Primitive:
                const prim = type;
                switch(prim.name){
                    case PrimitiveName.DateTime:
                        this.addType("Time", {
                            type: "time.Time",
                            import: "time"
                        });
                        break;
                }
                break;
            case Kind.Type:
                const named = type;
                const i1 = aliases[named.name];
                if (named.name === "datetime" && i1 == undefined) {
                    this.addType("Time", {
                        type: "time.Time",
                        import: "time"
                    });
                    return;
                }
                this.addType(named.name, i1);
                break;
            case Kind.List:
                const list = type;
                this.checkType(context, list.type);
                break;
            case Kind.Map:
                const map = type;
                this.checkType(context, map.keyType);
                this.checkType(context, map.valueType);
                break;
            case Kind.Optional:
                const optional = type;
                this.checkType(context, optional.type);
                break;
            case Kind.Enum:
                break;
        }
    }
    visitParameter(context) {
        if (!isValid1(context)) {
            return;
        }
        this.checkType(context, context.parameter.type);
    }
    visitOperation(context) {
        if (!isValid1(context)) {
            return;
        }
        this.checkType(context, context.operation.type);
    }
}
function isValid1(context) {
    const roleNames = context.config.names || [];
    const roleTypes = context.config.types || [];
    const { interface: iface  } = context;
    return isOneOfType(context, roleTypes) || roleNames.indexOf(iface.name) != -1;
}
const msgpackCodecFuncs = new Map([
    [
        "ID",
        "StringToBytes"
    ],
    [
        "bool",
        "BoolToBytes"
    ],
    [
        "string",
        "StringToBytes"
    ],
    [
        "datetime",
        "TimeToBytes"
    ],
    [
        "i8",
        "Int8ToBytes"
    ],
    [
        "u8",
        "Uint8ToBytes"
    ],
    [
        "i16",
        "Int16ToBytes"
    ],
    [
        "u16",
        "Uint16ToBytes"
    ],
    [
        "i32",
        "Int32ToBytes"
    ],
    [
        "u32",
        "Uint32ToBytes"
    ],
    [
        "i64",
        "Int64ToBytes"
    ],
    [
        "u64",
        "Uint64ToBytes"
    ],
    [
        "f32",
        "Float32ToBytes"
    ],
    [
        "f64",
        "Float64ToBytes"
    ],
    [
        "bytes",
        "ByteArraToBytesy"
    ]
]);
const msgpackDecodeFuncs = new Map([
    [
        "ID",
        "ReadString"
    ],
    [
        "bool",
        "ReadBool"
    ],
    [
        "string",
        "ReadString"
    ],
    [
        "datetime",
        "ReadTime"
    ],
    [
        "i8",
        "ReadInt8"
    ],
    [
        "u8",
        "ReadUint8"
    ],
    [
        "i16",
        "ReadInt16"
    ],
    [
        "u16",
        "ReadUint16"
    ],
    [
        "i32",
        "ReadInt32"
    ],
    [
        "u32",
        "ReadUint32"
    ],
    [
        "i64",
        "ReadInt64"
    ],
    [
        "u64",
        "ReadUint64"
    ],
    [
        "f32",
        "ReadFloat32"
    ],
    [
        "f64",
        "ReadFloat64"
    ],
    [
        "bytes",
        "ReadByteArray"
    ]
]);
const msgpackDecodeNillableFuncs = new Map([
    [
        "ID",
        "ReadNillableString"
    ],
    [
        "bool",
        "ReadNillableBool"
    ],
    [
        "string",
        "ReadNillableString"
    ],
    [
        "datetime",
        "ReadNillableTime"
    ],
    [
        "i8",
        "ReadNillableInt8"
    ],
    [
        "u8",
        "ReadNillableUint8"
    ],
    [
        "i16",
        "ReadNillableInt16"
    ],
    [
        "u16",
        "ReadNillableUint16"
    ],
    [
        "i32",
        "ReadNillableInt32"
    ],
    [
        "u32",
        "ReadNillableUint32"
    ],
    [
        "i64",
        "ReadNillableInt64"
    ],
    [
        "u64",
        "ReadNillableUint64"
    ],
    [
        "f32",
        "ReadNillableFloat32"
    ],
    [
        "f64",
        "ReadNillableFloat64"
    ],
    [
        "bytes",
        "ReadNillableByteArray"
    ]
]);
const msgpackEncodeFuncs = new Map([
    [
        "ID",
        "WriteString"
    ],
    [
        "bool",
        "WriteBool"
    ],
    [
        "string",
        "WriteString"
    ],
    [
        "datetime",
        "WriteTime"
    ],
    [
        "i8",
        "WriteInt8"
    ],
    [
        "u8",
        "WriteUint8"
    ],
    [
        "i16",
        "WriteInt16"
    ],
    [
        "u16",
        "WriteUint16"
    ],
    [
        "i32",
        "WriteInt32"
    ],
    [
        "u32",
        "WriteUint32"
    ],
    [
        "i64",
        "WriteInt64"
    ],
    [
        "u64",
        "WriteUint64"
    ],
    [
        "f32",
        "WriteFloat32"
    ],
    [
        "f64",
        "WriteFloat64"
    ],
    [
        "bytes",
        "WriteByteArray"
    ]
]);
const msgpackEncodeNillableFuncs = new Map([
    [
        "ID",
        "WriteNillableString"
    ],
    [
        "bool",
        "WriteNillableBool"
    ],
    [
        "string",
        "WriteNillableString"
    ],
    [
        "datetime",
        "WriteNillableTime"
    ],
    [
        "i8",
        "WriteNillableInt8"
    ],
    [
        "u8",
        "WriteNillableUint8"
    ],
    [
        "i16",
        "WriteNillableInt16"
    ],
    [
        "u16",
        "WriteNillableUint16"
    ],
    [
        "i32",
        "WriteNillableInt32"
    ],
    [
        "u32",
        "WriteNillableUint32"
    ],
    [
        "i64",
        "WriteNillableInt64"
    ],
    [
        "u64",
        "WriteNillableUint64"
    ],
    [
        "f32",
        "WriteNillableFloat32"
    ],
    [
        "f64",
        "WriteNillableFloat64"
    ],
    [
        "bytes",
        "WriteNillableByteArray"
    ]
]);
const msgpackCastFuncs = new Map([
    [
        "ID",
        "convert.String"
    ],
    [
        "bool",
        "convert.Bool"
    ],
    [
        "string",
        "convert.String"
    ],
    [
        "i8",
        "convert.Numeric"
    ],
    [
        "u8",
        "convert.Numeric.Numerict8"
    ],
    [
        "i16",
        "convert.Numeric"
    ],
    [
        "u16",
        "convert.Numeric"
    ],
    [
        "i32",
        "convert.Numeric"
    ],
    [
        "u32",
        "convert.Numeric"
    ],
    [
        "i64",
        "convert.Numeric"
    ],
    [
        "u64",
        "convert.Numeric"
    ],
    [
        "f32",
        "convert.Numeric"
    ],
    [
        "f64",
        "convert.Numeric"
    ],
    [
        "bytes",
        "convert.ByteArray"
    ]
]);
const msgpackCastNillableFuncs = new Map([
    [
        "ID",
        "convert.NillableString"
    ],
    [
        "bool",
        "convert.NillableBool"
    ],
    [
        "string",
        "convert.NillableString"
    ],
    [
        "i8",
        "convert.NillableNumeric"
    ],
    [
        "u8",
        "convert.NillableNumeric"
    ],
    [
        "i16",
        "convert.NillableNumeric"
    ],
    [
        "u16",
        "convert.NillableNumeric"
    ],
    [
        "i32",
        "convert.NillableNumeric"
    ],
    [
        "u32",
        "convert.NillableNumeric"
    ],
    [
        "i64",
        "convert.NillableNumeric"
    ],
    [
        "u64",
        "convert.NillableNumeric"
    ],
    [
        "f32",
        "convert.NillableNumeric"
    ],
    [
        "f64",
        "convert.NillableNumeric"
    ],
    [
        "bytes",
        "convert.ByteArray"
    ]
]);
function msgpackRead(context, typeInstRef, variable, errorHandling, defaultVal, t, prevOptional) {
    const tr = translateAlias(context);
    const returnPrefix = defaultVal == "" ? "" : `${defaultVal}, `;
    let prefix = "return ";
    let assign = variable == "item" || variable == "key" || variable == "value" || variable == "ret" || variable == "request" ? ":=" : "=";
    if (variable != "") {
        if (variable == "item" || variable == "key" || variable == "value" || variable == "ret" || variable == "request") {
            if (errorHandling) {
                prefix = variable + ", err := ";
            } else {
                prefix = variable + " := ";
            }
        } else {
            if (t.kind == Kind.Type && !prevOptional) {
                if (errorHandling) {
                    prefix = "err = ";
                }
                return `${prefix}${variable}.Decode(decoder)\n`;
            }
            if (errorHandling) {
                prefix = variable + ", err = ";
            } else {
                prefix = variable + " = ";
            }
        }
    }
    const passedType = t;
    if (t.kind == Kind.Alias) {
        const aliases = context.config.aliases || {};
        const a = t;
        if (a.type.kind == Kind.Primitive) {
            const prim = a.type;
            const imp = aliases[a.name];
            if (imp && imp.parse) {
                if (prevOptional) {
                    const decoder = msgpackDecodeNillableFuncs.get(prim.name);
                    return `${prefix}convert.NillableParse(${imp.parse})(decoder.${decoder}())\n`;
                } else {
                    const decoder1 = msgpackDecodeFuncs.get(prim.name);
                    return `${prefix}convert.Parse(${imp.parse})(decoder.${decoder1}())\n`;
                }
            }
            if (prevOptional) {
                const caster = msgpackCastNillableFuncs.get(prim.name);
                const decoder2 = msgpackDecodeNillableFuncs.get(prim.name);
                return `${prefix}${caster}[${a.name}](decoder.${decoder2}())\n`;
            } else {
                const caster1 = msgpackCastFuncs.get(prim.name);
                const decoder3 = msgpackDecodeFuncs.get(prim.name);
                return `${prefix}${caster1}[${a.name}](decoder.${decoder3}())\n`;
            }
        }
        t = a.type;
    }
    switch(t.kind){
        case Kind.Union:
        case Kind.Type:
        case Kind.Primitive:
            {
                let namedNode = t;
                const amp = typeInstRef ? "&" : "";
                let decodeFn = `msgpack.Decode[${namedNode.name}](${amp}decoder)`;
                if (prevOptional) {
                    decodeFn = `msgpack.DecodeNillable[${namedNode.name}](decoder)`;
                }
                if (prevOptional && msgpackDecodeNillableFuncs.has(namedNode.name)) {
                    decodeFn = `decoder.${msgpackDecodeNillableFuncs.get(namedNode.name)}()`;
                } else if (msgpackDecodeFuncs.has(namedNode.name)) {
                    decodeFn = `decoder.${msgpackDecodeFuncs.get(namedNode.name)}()`;
                }
                return `${prefix}${decodeFn}\n`;
            }
        case Kind.Enum:
            {
                let e = t;
                let decodeFn1 = `convert.Numeric[${e.name}](decoder.ReadInt32())`;
                if (prevOptional) {
                    decodeFn1 = `convert.NillableNumeric[${e.name}](decoder.ReadNillableInt32())`;
                }
                return `${prefix}${decodeFn1}\n`;
            }
        case Kind.Map:
            let mapCode = `mapSize, err := decoder.ReadMapSize()
      if err != nil {
        return ${returnPrefix}err
      }\n`;
            if (variable == "ret") {
                mapCode += "ret :=";
            } else {
                mapCode += `${variable} ${assign} `;
            }
            mapCode += `make(${expandType1(passedType, undefined, true, tr)}, mapSize)\n`;
            mapCode += `for mapSize > 0 {
        mapSize--\n`;
            mapCode += msgpackRead(context, typeInstRef, "key", true, defaultVal, t.keyType, false);
            if (!mapCode.endsWith(`\n`)) {
                mapCode += `\n`;
            }
            mapCode += `if err != nil {
          return ${returnPrefix}err
        }\n`;
            mapCode += msgpackRead(context, typeInstRef, "value", true, defaultVal, t.valueType, false);
            if (!mapCode.endsWith(`\n`)) {
                mapCode += `\n`;
            }
            mapCode += `if err != nil {
          return ${returnPrefix}err
        }\n`;
            mapCode += `${variable}[key] = value
      }\n`;
            return mapCode;
        case Kind.List:
            let listCode = `listSize, err := decoder.ReadArraySize()
      if err != nil {
        return ${returnPrefix}err
      }\n`;
            if (variable == "ret") {
                listCode += "ret :=";
            } else {
                listCode += `${variable} ${assign} `;
            }
            listCode += `make(${expandType1(passedType, undefined, true, tr)}, 0, listSize)\n`;
            listCode += `for listSize > 0 {
        listSize--
        var nonNilItem ${t.type.kind == Kind.Optional ? "*" : ""}${expandType1(t.type, undefined, false, tr)}\n`;
            listCode += msgpackRead(context, typeInstRef, "nonNilItem", true, defaultVal, t.type, false);
            if (!listCode.endsWith(`\n`)) {
                listCode += `\n`;
            }
            listCode += `if err != nil {
          return ${returnPrefix}err
        }\n`;
            listCode += `${variable} = append(${variable}, nonNilItem)
      }\n`;
            return listCode;
        case Kind.Optional:
            const optNode = t;
            optNode.type;
            switch(optNode.type.kind){
                case Kind.List:
                case Kind.Map:
                    return msgpackRead(context, typeInstRef, variable, false, defaultVal, optNode.type, true);
            }
            let optCode = "";
            optCode += msgpackRead(context, typeInstRef, variable, true, defaultVal, optNode.type, true);
            return optCode;
        default:
            return "unknown\n";
    }
}
function msgpackWrite(context, typeInst, typeInstRef, typeClass, typeMeth, variable, t, prevOptional) {
    let code = "";
    if (t.kind == Kind.Alias) {
        const aliases = context.config.aliases || {};
        const a = t;
        const imp = aliases[a.name];
        const p = a.type;
        if (imp && imp.format) {
            return `${typeInst}.${msgpackEncodeFuncs.get(p.name)}(${variable}.${imp.format}())\n`;
        }
        const castType = translations1.get(p.name);
        if (prevOptional && msgpackEncodeNillableFuncs.has(p.name)) {
            return `${typeInst}.${msgpackEncodeNillableFuncs.get(p.name)}((*${castType})(${variable}))\n`;
        }
        if (msgpackEncodeFuncs.has(p.name)) {
            return `${typeInst}.${msgpackEncodeFuncs.get(p.name)}(${castType}(${variable}))\n`;
        }
        t = a.type;
    }
    switch(t.kind){
        case Kind.Union:
        case Kind.Type:
        case Kind.Primitive:
            const namedNode = t;
            if (prevOptional && msgpackEncodeNillableFuncs.has(namedNode.name)) {
                return `${typeInst}.${msgpackEncodeNillableFuncs.get(namedNode.name)}(${variable})\n`;
            }
            if (msgpackEncodeFuncs.has(namedNode.name)) {
                return `${typeInst}.${msgpackEncodeFuncs.get(namedNode.name)}(${variable})\n`;
            }
            const amp = typeInstRef ? "&" : "";
            return `${variable}.${typeMeth}(${amp}${typeInst})\n`;
        case Kind.Enum:
            if (!prevOptional) {
                return `${typeInst}.WriteInt32(int32(${variable}))\n`;
            }
            return `${typeInst}.WriteNillableInt32((*int32)(${variable}))\n`;
        case Kind.Map:
            const mappedNode = t;
            code += typeInst + `.WriteMapSize(uint32(len(${variable})))
      if ${variable} != nil { // TinyGo bug: ranging over nil maps panics.
      for k, v := range ${variable} {
        ${msgpackWrite(context, typeInst, typeInstRef, typeClass, typeMeth, "k", mappedNode.keyType, false)}${msgpackWrite(context, typeInst, typeInstRef, typeClass, typeMeth, "v", mappedNode.valueType, false)}}
      }\n`;
            return code;
        case Kind.List:
            const listNode = t;
            code += typeInst + `.WriteArraySize(uint32(len(${variable})))
      for _, v := range ${variable} {
        ${msgpackWrite(context, typeInst, typeInstRef, typeClass, typeMeth, "v", listNode.type, false)}}\n`;
            return code;
        case Kind.Optional:
            const optionalNode = t;
            switch(optionalNode.type.kind){
                case Kind.Alias:
                    const a1 = optionalNode.type;
                    const aliases1 = context.config.aliases || {};
                    const imp1 = aliases1[a1.name];
                    if (imp1 && imp1.format) {
                        break;
                    }
                case Kind.List:
                case Kind.Map:
                case Kind.Enum:
                case Kind.Type:
                case Kind.Primitive:
                    return msgpackWrite(context, typeInst, typeInstRef, typeClass, typeMeth, variable, optionalNode.type, true);
            }
            code += "if " + variable + " == nil {\n";
            code += typeInst + ".WriteNil()\n";
            code += "} else {\n";
            let vprefix = msgpackReturnDeref(context, optionalNode.type);
            code += msgpackWrite(context, typeInst, typeInstRef, typeClass, typeMeth, vprefix + variable, optionalNode.type, true);
            code += "}\n";
            return code;
        default:
            return "unknown\n";
    }
}
function msgpackReturnDeref(context, type) {
    if (type.kind === Kind.Alias) {
        const a = type;
        const aliases = context.config.aliases || {};
        const imp = aliases[a.name];
        if (imp && imp.format) {
            return "";
        }
        type = a.type;
    }
    if (type.kind === Kind.Primitive) {
        const p = type;
        if (p.name != PrimitiveName.Bytes) {
            return "*";
        }
    }
    return "";
}
function msgpackSize(context, typeInstRef, variable, t) {
    return msgpackWrite(context, "sizer", typeInstRef, "Writer", "Encode", variable, t, false);
}
function msgpackEncode(context, typeInstRef, variable, t) {
    return msgpackWrite(context, "encoder", typeInstRef, "Writer", "Encode", variable, t, false);
}
function msgpackVarAccessParam(variable, args) {
    return `ctx` + (args.length > 0 ? ", " : "") + args.map((arg)=>{
        return `${returnShare(arg.type)}${variable}.${fieldName(arg, arg.name)}`;
    }).join(", ");
}
class MsgPackDecoderVisitor extends BaseVisitor {
    visitTypeFieldsBefore(context) {
        super.triggerTypeFieldsBefore(context);
        const type = context.type;
        this.write(`func (o *${type.name}) Decode(decoder msgpack.Reader) error {
    numFields, err := decoder.ReadMapSize()
    if err != nil {
      return err
    }

    for numFields > 0 {
      numFields--;
      ${context.fields.length > 0 ? "field" : "_"}, err := decoder.ReadString()
      if err != nil {
        return err
      }\n`);
        if (context.fields.length > 0) {
            this.write(`switch field {\n`);
        }
    }
    visitTypeField(context) {
        const field = context.field;
        this.write(`case "${field.name}":\n`);
        this.write(msgpackRead(context, false, `o.${fieldName(field, field.name)}`, true, "", field.type, false));
        super.triggerTypeField(context);
    }
    visitTypeFieldsAfter(context) {
        if (context.fields.length > 0) {
            this.write(`default:
        err = decoder.Skip()
      }\n`);
        } else {
            this.write(`err = decoder.Skip()\n`);
        }
        this.write(`if err != nil {
      return err
    }
  }\n`);
        this.write(`
    return nil
  }\n\n`);
        super.triggerTypeFieldsAfter(context);
    }
}
class MsgPackEncoderVisitor extends BaseVisitor {
    visitTypeFieldsBefore(context) {
        super.triggerTypeFieldsBefore(context);
        this.write(`func (o *${context.type.name}) Encode(encoder msgpack.Writer) error {
    if o == nil {
      encoder.WriteNil()
      return nil
    }
    encoder.WriteMapSize(${context.fields.length})\n`);
    }
    visitTypeField(context) {
        const field = context.field;
        this.write(`encoder.WriteString("${field.name}")\n`);
        this.write(msgpackEncode(context, false, "o." + fieldName(field, field.name), field.type));
        super.triggerTypeField(context);
    }
    visitTypeFieldsAfter(context) {
        this.write(`
    return nil
  }\n\n`);
        super.triggerTypeFieldsAfter(context);
    }
}
class MsgPackEncoderUnionVisitor extends BaseVisitor {
    visitTypeFieldsBefore(context) {
        super.triggerTypeFieldsBefore(context);
        this.write(`func (o *${context.type.name}) Encode(encoder msgpack.Writer) error {
    if o == nil {
      encoder.WriteNil()
      return nil
    }\n`);
    }
    visitTypeField(context) {
        const field = context.field;
        this.write(`if o.${fieldName(field, field.name)} != nil {\n`);
        this.write(`encoder.WriteMapSize(1)\n`);
        this.write(`encoder.WriteString("${field.name}")\n`);
        this.write(msgpackEncode(context, false, "o." + fieldName(field, field.name), field.type));
        this.write(`return nil\n`);
        this.write(`}\n`);
        super.triggerTypeField(context);
    }
    visitTypeFieldsAfter(context) {
        this.write(`
    encoder.WriteNil()
    return nil
  }\n\n`);
        super.triggerTypeFieldsAfter(context);
    }
}
class MsgPackVisitor extends BaseVisitor {
    constructor(writer){
        super(writer);
        const operArgs = (context)=>{
            const { interface: iface , operation  } = context;
            const parameters = operation.parameters.filter((p)=>p.type.kind != Kind.Stream);
            if (parameters.length == 0 || operation.isUnary()) {
                return;
            }
            const tr = context.getType.bind(context);
            const type = convertOperationToType(tr, iface, operation);
            const ctx = context.clone({
                type: type
            });
            const struct = new StructVisitor(this.writer);
            type.accept(ctx, struct);
            const decoder = new MsgPackDecoderVisitor(this.writer);
            type.accept(ctx, decoder);
            const encoder = new MsgPackEncoderVisitor(this.writer);
            type.accept(ctx, encoder);
            this.write(`\n`);
        };
        this.setCallback("FunctionAfter", "arguments", operArgs);
        this.setCallback("OperationAfter", "arguments", operArgs);
    }
    visitNamespaceBefore(context) {
        const packageName = context.config["package"] || "module";
        this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.

    package ${packageName}

    import (
      "github.com/wapc/tinygo-msgpack"
      "github.com/wapc/tinygo-msgpack/convert"\n`);
        const aliases = context.config.aliases || {};
        for (let a of Object.values(aliases)){
            if (a.import) {
                this.write(`\t"${a.import}"\n`);
            }
        }
        this.write(`)

    var _ = convert.Package\n\n`);
        super.triggerNamespaceBefore(context);
    }
    visitType(context) {
        const { type  } = context;
        const decoder = new MsgPackDecoderVisitor(this.writer);
        type.accept(context, decoder);
        const encoder = new MsgPackEncoderVisitor(this.writer);
        type.accept(context, encoder);
        this.write(`\n`);
    }
    visitUnion(context) {
        const { union  } = context;
        const tr = context.getType.bind(context);
        const type = convertUnionToType(tr, union);
        const ctx = context.clone({
            type: type
        });
        const decoder = new MsgPackDecoderVisitor(this.writer);
        type.accept(ctx, decoder);
        const encoder = new MsgPackEncoderUnionVisitor(this.writer);
        type.accept(ctx, encoder);
        this.write(`\n`);
    }
}
const mod2 = {
    default: InterfacesVisitor,
    translateAlias,
    AliasVisitor,
    mapVals,
    defValue,
    returnPointer,
    returnShare,
    defaultValueForType,
    strQuote,
    setExpandStreamPattern,
    expandType: expandType1,
    fieldName,
    methodName,
    parameterName,
    opsAsFns,
    mapParams,
    mapParam,
    varAccessArg,
    receiver,
    translations: translations1,
    EnumVisitor: EnumVisitor1,
    EnumVisitorToStringMap,
    EnumVisitorToIDMap,
    FiberVisitor,
    StructVisitor,
    GRPCVisitor,
    InputOutputVisitor,
    ImportsVisitor: ImportsVisitor1,
    InterfaceVisitor: InterfaceVisitor1,
    InterfacesVisitor,
    UnionVisitor,
    MainVisitor,
    ScaffoldVisitor: ScaffoldVisitor1,
    MsgPackVisitor,
    MsgPackDecoderVisitor,
    msgpackRead,
    msgpackWrite,
    msgpackSize,
    msgpackEncode,
    msgpackVarAccessParam,
    msgpackCodecFuncs,
    msgpackDecodeFuncs,
    msgpackDecodeNillableFuncs,
    msgpackEncodeFuncs,
    msgpackEncodeNillableFuncs,
    msgpackCastFuncs,
    msgpackCastNillableFuncs,
    MsgPackEncoderVisitor,
    MsgPackEncoderUnionVisitor
};
class UnionVisitor1 extends BaseVisitor {
    visitUnion(context) {
        const { union  } = context;
        this.write(`  ${formatComment("// ", union.description)}`);
        this.write(`public record ${union.name} {\n`);
        union.types.forEach((t)=>{
            const typeName = expandType1(t);
            this.write(`    public ${pascalCase(typeName)} ${typeName};`);
            this.triggerCallbacks(context, "UnionStructTags");
            this.write(`\n`);
        });
        this.write(`  }\n\n`);
    }
}
class AliasVisitor1 extends BaseVisitor {
    visitAlias(context) {
        const { config , alias  } = context;
        const aliases = config.aliases;
        if (aliases && aliases[alias.name]) {
            return;
        }
        this.write(formatComment("// ", alias.description));
        this.write(`  using ${pascalCase(alias.name)} = ${expandType1(alias.type)};\n\n`);
        super.triggerTypeField(context);
    }
}
class InterfacesVisitor1 extends BaseVisitor {
    typeVisitor = (writer)=>new TypeVisitor(writer);
    interfaceVisitor = (writer)=>new InterfaceVisitor(writer);
    enumVisitor = (writer)=>new EnumVisitor(writer);
    unionVisitor = (writer)=>new UnionVisitor1(writer);
    aliasVisitor = (writer)=>new AliasVisitor1(writer);
    visitNamespaceBefore(context) {
        this.write(`// Code generated by @apexlang/codegen. DO NOT EDIT.\n\n`);
        super.visitNamespaceBefore(context);
    }
    visitNamespace(context) {
        this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);
        super.visitNamespace(context);
    }
    visitNamespaceAfter(context) {
        this.write(`}\n`);
        super.visitNamespaceAfter(context);
    }
    visitInterface(context) {
        const visitor = this.interfaceVisitor(this.writer);
        context.interface.accept(context, visitor);
    }
    visitUnion(context) {
        const visitor = this.unionVisitor(this.writer);
        context.union.accept(context, visitor);
    }
    visitAlias(context) {
        const visitor = this.aliasVisitor(this.writer);
        context.alias.accept(context, visitor);
    }
    visitEnum(context) {
        const visitor = this.enumVisitor(this.writer);
        context.enum.accept(context, visitor);
    }
    visitType(context) {
        const visitor = this.typeVisitor(this.writer);
        context.type.accept(context, visitor);
    }
}
class MainVisitor1 extends BaseVisitor {
    visitNamespaceBefore(context) {
        this.write(`namespace ${parseNamespaceName(context.namespace.name)} {\n`);
        super.visitNamespace(context);
    }
    visitNamespace(context) {
        this.write(`public class MainClass {\n`);
        this.write(`\t public static void Main(String[] args) {\n`);
        super.visitNamespace(context);
    }
    visitInterface(context) {
        const { interface: iface  } = context;
        if (iface.annotation("service")) {
            if (iface.annotation("uses")) {
                iface.annotation("uses", (a)=>{
                    this.write(`\t\t ${iface.name}Impl ${iface.name.toString().toLowerCase()} = new ${iface.name}Impl(new ${a.arguments[0].value.getValue()}Impl());\n`);
                });
            }
        }
        super.visitInterface(context);
    }
    visitNamespaceAfter(context) {
        this.write(`\t\t }\n`);
        this.write(`\t}\n`);
        this.write(`}\n`);
        super.visitNamespaceAfter(context);
    }
}
class IndexVisitor extends BaseVisitor {
    apiVisitor = (writer)=>new MinimalAPIVisitor(writer);
    scaffoldVisitor = (writer)=>new ScaffoldVisitor(writer);
    interfacesVisitor = (writer)=>new InterfacesVisitor1(writer);
    main_visitor = (writer)=>new MainVisitor1(writer);
    typeVisitor = (writer)=>new TypeVisitor(writer);
    visitNamespaceBefore(context) {
        const visitor = this.apiVisitor(this.writer);
        context.namespace.accept(context, visitor);
        this.write(`\n`);
        super.visitNamespaceBefore(context);
    }
    visitNamespace(context) {
        const visitor = this.scaffoldVisitor(this.writer);
        context.namespace.accept(context, visitor);
        this.write(`\n`);
        super.visitNamespace(context);
    }
    visitInterface(context) {
        const visitor = this.interfacesVisitor(this.writer);
        context.interface.accept(context, visitor);
        this.write(`\n`);
        super.visitInterface(context);
    }
    visitNamespaceAfter(context) {
        const visitor = this.main_visitor(this.writer);
        context.namespace.accept(context, visitor);
        this.write(`\n`);
        super.visitNamespaceBefore(context);
    }
    visitType(context) {
        const visitor = this.typeVisitor(this.writer);
        context.type.accept(context, visitor);
        super.visitType(context);
    }
}
const mod3 = {
    default: InterfacesVisitor1,
    MinimalAPIVisitor,
    ApiServiceVisitor,
    TypeVisitor,
    ScaffoldVisitor,
    ServiceVisitor,
    InterfaceVisitor,
    InterfacesVisitor: InterfacesVisitor1,
    EnumVisitor,
    UnionVisitor: UnionVisitor1,
    AliasVisitor: AliasVisitor1,
    MainVisitor: MainVisitor1,
    IndexVisitor
};
class JsonSchemaVisitor extends BaseVisitor {
    path = "";
    method = "";
    schema = {};
    constructor(writer){
        super(writer);
    }
    visitNamespace(context) {
        context.config;
        this.schema.title = context.namespace.name;
    }
    visitNamespaceAfter(context) {
        this.write(JSON.stringify(this.schema.valueOf(), null, 2));
    }
    visitType(context) {
        const visitor = new TypeVisitor1(this.writer);
        context.type.accept(context, visitor);
        if (!this.schema.$defs) {
            this.schema.$defs = {};
        }
        this.schema.$defs[context.type?.name] = visitor.def;
    }
    visitEnum(context) {
        const visitor = new EnumVisitor2(this.writer);
        context.enum.accept(context, visitor);
        if (!this.schema.$defs) {
            this.schema.$defs = {};
        }
        this.schema.$defs[context.enum?.name] = visitor.def;
    }
    visitUnion(context) {
        const visitor = new UnionVisitor2(this.writer);
        context.union.accept(context, visitor);
        if (!this.schema.$defs) {
            this.schema.$defs = {};
        }
        this.schema.$defs[context.union?.name] = visitor.def;
    }
    visitAlias(context) {
        const visitor = new AliasVisitor2(this.writer);
        context.alias.accept(context, visitor);
        if (!this.schema.$defs) {
            this.schema.$defs = {};
        }
        this.schema.$defs[context.alias.name] = visitor.def;
    }
}
class TypeVisitor1 extends BaseVisitor {
    def = {
        properties: {},
        required: []
    };
    constructor(writer){
        super(writer);
    }
    visitTypeField(context) {
        const def = {};
        if (context.field.description) {
            def.description = context.field.description;
        }
        let [_def, isRequired] = decorateType(def, context.field.type);
        if (isRequired) {
            this.def.required.push(context.field.name);
        }
        this.def.properties[context.field.name] = def;
    }
}
class EnumVisitor2 extends BaseVisitor {
    def = {
        enum: []
    };
    constructor(writer){
        super(writer);
    }
    visitEnum(context) {
        const schema = {
            description: context.enum.description,
            type: JsonSchemaType.String,
            enum: context.enum.values.map((ev)=>ev.display || ev.name)
        };
        this.def = schema;
    }
}
class UnionVisitor2 extends BaseVisitor {
    def = {
        properties: {}
    };
    constructor(writer){
        super(writer);
    }
    visitUnion(context) {
        const { union  } = context;
        let arr = [];
        convertArrayToObject(union.types, (t)=>{
            switch(t.kind){
                case Kind.Union:
                case Kind.Type:
                case Kind.Enum:
                    return t.name.value;
                case Kind.Primitive:
                    return t.name;
            }
            return "unknown";
        }, (t)=>{
            const [def] = decorateType({}, t);
            arr.push(def);
        });
        const schema = {
            description: union.description,
            type: JsonSchemaType.Object,
            oneOf: arr
        };
        this.def = schema;
    }
}
class AliasVisitor2 extends BaseVisitor {
    def = {};
    constructor(writer){
        super(writer);
    }
    visitAlias(context) {
        const schema = {
            description: context.alias.description
        };
        decorateType(schema, context.alias.type);
        this.def = schema;
    }
}
var JsonSchemaType;
(function(JsonSchemaType) {
    JsonSchemaType["Integer"] = "integer";
    JsonSchemaType["Number"] = "number";
    JsonSchemaType["String"] = "string";
    JsonSchemaType["Boolean"] = "boolean";
    JsonSchemaType["Object"] = "object";
    JsonSchemaType["Null"] = "null";
    JsonSchemaType["Array"] = "array";
})(JsonSchemaType || (JsonSchemaType = {}));
var JsonSchemaTypeFormat;
(function(JsonSchemaTypeFormat) {
    JsonSchemaTypeFormat["Int32"] = "int32";
    JsonSchemaTypeFormat["Int64"] = "int64";
    JsonSchemaTypeFormat["Float"] = "float";
    JsonSchemaTypeFormat["Double"] = "double";
    JsonSchemaTypeFormat["Byte"] = "byte";
    JsonSchemaTypeFormat["Binary"] = "binary";
    JsonSchemaTypeFormat["Date"] = "date";
    JsonSchemaTypeFormat["DateTime"] = "date-time";
    JsonSchemaTypeFormat["Password"] = "password";
})(JsonSchemaTypeFormat || (JsonSchemaTypeFormat = {}));
function decorateType(def, typ) {
    let required = true;
    switch(typ.kind){
        case Kind.List:
            {
                const t = typ;
                def = def;
                def.type = JsonSchemaType.Array;
                const [listType, _isRequired] = decorateType({}, t.type);
                def.items = listType;
                break;
            }
        case Kind.Map:
            {
                const t1 = typ;
                def.type = JsonSchemaType.Object;
                if (!isApexStringType(t1.keyType)) throw new Error("Can not represent maps with non-string key types in JSON Schema");
                const [valueType, _isRequired1] = decorateType({}, t1.valueType);
                def.patternProperties = {
                    ".*": valueType
                };
                break;
            }
        case Kind.Optional:
            {
                const t2 = typ;
                required = false;
                decorateType(def, t2.type);
                break;
            }
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            {
                const t3 = typ;
                def.$ref = `#/$defs/${t3.name}`;
                break;
            }
        case Kind.Primitive:
            {
                const t4 = typ;
                switch(t4.name){
                    case PrimitiveName.Bool:
                        def.type = JsonSchemaType.Boolean;
                        break;
                    case PrimitiveName.Bytes:
                        def.type = JsonSchemaType.Array;
                        def = def;
                        def.items = {
                            type: "number"
                        };
                        break;
                    case PrimitiveName.DateTime:
                        def.type = JsonSchemaType.String;
                        def.format = JsonSchemaTypeFormat.DateTime;
                        break;
                    case PrimitiveName.F32:
                    case PrimitiveName.F64:
                        def.type = JsonSchemaType.Number;
                        break;
                    case PrimitiveName.I8:
                    case PrimitiveName.I16:
                    case PrimitiveName.I32:
                    case PrimitiveName.I64:
                    case PrimitiveName.U8:
                    case PrimitiveName.U16:
                    case PrimitiveName.U32:
                    case PrimitiveName.U64:
                        def.type = JsonSchemaType.Integer;
                        break;
                    case PrimitiveName.String:
                        def.type = JsonSchemaType.String;
                        break;
                    default:
                        throw new Error(`Unhandled primitive type conversion for type: ${t4.name}`);
                }
                break;
            }
        default:
            {
                throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
            }
    }
    return [
        def,
        required
    ];
}
function isApexStringType(typ) {
    if (typ.kind === Kind.Primitive) {
        const t = typ;
        return t.name == PrimitiveName.String;
    }
    return false;
}
const mod4 = {
    JsonSchemaVisitor: JsonSchemaVisitor,
    default: JsonSchemaVisitor
};
!function(e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).jsyaml = e();
}(function() {
    return (function o(a, s, c) {
        function u(t, e) {
            if (!s[t]) {
                if (!a[t]) {
                    var n = "function" == typeof require && require;
                    if (!e && n) return n(t, !0);
                    if (l) return l(t, !0);
                    var i = new Error("Cannot find module '" + t + "'");
                    throw i.code = "MODULE_NOT_FOUND", i;
                }
                var r = s[t] = {
                    exports: {}
                };
                a[t][0].call(r.exports, function(e) {
                    return u(a[t][1][e] || e);
                }, r, r.exports, o, a, s, c);
            }
            return s[t].exports;
        }
        for(var l = "function" == typeof require && require, e = 0; e < c.length; e++)u(c[e]);
        return u;
    })({
        1: [
            function(e, t, n) {
                "use strict";
                var i = e("./js-yaml/loader"), r = e("./js-yaml/dumper");
                function o(e) {
                    return function() {
                        throw new Error("Function " + e + " is deprecated and cannot be used.");
                    };
                }
                t.exports.Type = e("./js-yaml/type"), t.exports.Schema = e("./js-yaml/schema"), t.exports.FAILSAFE_SCHEMA = e("./js-yaml/schema/failsafe"), t.exports.JSON_SCHEMA = e("./js-yaml/schema/json"), t.exports.CORE_SCHEMA = e("./js-yaml/schema/core"), t.exports.DEFAULT_SAFE_SCHEMA = e("./js-yaml/schema/default_safe"), t.exports.DEFAULT_FULL_SCHEMA = e("./js-yaml/schema/default_full"), t.exports.load = i.load, t.exports.loadAll = i.loadAll, t.exports.safeLoad = i.safeLoad, t.exports.safeLoadAll = i.safeLoadAll, t.exports.dump = r.dump, t.exports.safeDump = r.safeDump, t.exports.YAMLException = e("./js-yaml/exception"), t.exports.MINIMAL_SCHEMA = e("./js-yaml/schema/failsafe"), t.exports.SAFE_SCHEMA = e("./js-yaml/schema/default_safe"), t.exports.DEFAULT_SCHEMA = e("./js-yaml/schema/default_full"), t.exports.scan = o("scan"), t.exports.parse = o("parse"), t.exports.compose = o("compose"), t.exports.addConstructor = o("addConstructor");
            },
            {
                "./js-yaml/dumper": 3,
                "./js-yaml/exception": 4,
                "./js-yaml/loader": 5,
                "./js-yaml/schema": 7,
                "./js-yaml/schema/core": 8,
                "./js-yaml/schema/default_full": 9,
                "./js-yaml/schema/default_safe": 10,
                "./js-yaml/schema/failsafe": 11,
                "./js-yaml/schema/json": 12,
                "./js-yaml/type": 13
            }
        ],
        2: [
            function(e, t, n) {
                "use strict";
                function i(e) {
                    return null == e;
                }
                t.exports.isNothing = i, t.exports.isObject = function(e) {
                    return "object" == typeof e && null !== e;
                }, t.exports.toArray = function(e) {
                    return Array.isArray(e) ? e : i(e) ? [] : [
                        e
                    ];
                }, t.exports.repeat = function(e, t) {
                    for(var n = "", i = 0; i < t; i += 1)n += e;
                    return n;
                }, t.exports.isNegativeZero = function(e) {
                    return 0 === e && Number.NEGATIVE_INFINITY === 1 / e;
                }, t.exports.extend = function(e, t) {
                    var n, i, r, o;
                    if (t) for(n = 0, i = (o = Object.keys(t)).length; n < i; n += 1)e[r = o[n]] = t[r];
                    return e;
                };
            },
            {}
        ],
        3: [
            function(e, t, n) {
                "use strict";
                var c = e("./common"), d = e("./exception"), i = e("./schema/default_full"), r = e("./schema/default_safe"), p = Object.prototype.toString, u = Object.prototype.hasOwnProperty, o = 9, h = 10, a = 13, s = 32, m = 33, g = 34, y = 35, x = 37, v = 38, A = 39, b = 42, w = 44, C = 45, k = 58, j = 61, S = 62, I = 63, O = 64, E = 91, F = 93, _ = 96, N = 123, M = 124, T = 125, l = {
                    0: "\\0",
                    7: "\\a",
                    8: "\\b",
                    9: "\\t",
                    10: "\\n",
                    11: "\\v",
                    12: "\\f",
                    13: "\\r",
                    27: "\\e",
                    34: '\\"',
                    92: "\\\\",
                    133: "\\N",
                    160: "\\_",
                    8232: "\\L",
                    8233: "\\P"
                }, f = [
                    "y",
                    "Y",
                    "yes",
                    "Yes",
                    "YES",
                    "on",
                    "On",
                    "ON",
                    "n",
                    "N",
                    "no",
                    "No",
                    "NO",
                    "off",
                    "Off",
                    "OFF"
                ];
                function L(e) {
                    var t, n, i = e.toString(16).toUpperCase();
                    if (e <= 255) t = "x", n = 2;
                    else if (e <= 65535) t = "u", n = 4;
                    else {
                        if (!(e <= 4294967295)) throw new d("code point within a string may not be greater than 0xFFFFFFFF");
                        t = "U", n = 8;
                    }
                    return "\\" + t + c.repeat("0", n - i.length) + i;
                }
                function D(e) {
                    this.schema = e.schema || i, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = c.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = function(e, t) {
                        var n, i, r, o, a, s, c;
                        if (null === t) return {};
                        for(n = {}, r = 0, o = (i = Object.keys(t)).length; r < o; r += 1)a = i[r], s = String(t[a]), "!!" === a.slice(0, 2) && (a = "tag:yaml.org,2002:" + a.slice(2)), (c = e.compiledTypeMap.fallback[a]) && u.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[a] = s;
                        return n;
                    }(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
                }
                function U(e, t) {
                    for(var n, i = c.repeat(" ", t), r = 0, o = -1, a = "", s = e.length; r < s;)r = -1 === (o = e.indexOf("\n", r)) ? (n = e.slice(r), s) : (n = e.slice(r, o + 1), o + 1), n.length && "\n" !== n && (a += i), a += n;
                    return a;
                }
                function q(e, t) {
                    return "\n" + c.repeat(" ", e.indent * t);
                }
                function Y(e) {
                    return e === s || e === o;
                }
                function R(e) {
                    return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && 8232 !== e && 8233 !== e || 57344 <= e && e <= 65533 && 65279 !== e || 65536 <= e && e <= 1114111;
                }
                function B(e, t) {
                    return R(e) && 65279 !== e && e !== w && e !== E && e !== F && e !== N && e !== T && e !== k && (e !== y || t && R(n = t) && !Y(n) && 65279 !== n && n !== a && n !== h);
                    var n;
                }
                function P(e) {
                    return /^\n* /.test(e);
                }
                var W = 1, K = 2, $ = 3, H = 4, G = 5;
                function V(e, t, n, i, r) {
                    var o, a, s, c, u = !1, l = !1, p = -1 !== i, f = -1, d = R(c = e.charCodeAt(0)) && 65279 !== c && !Y(c) && c !== C && c !== I && c !== k && c !== w && c !== E && c !== F && c !== N && c !== T && c !== y && c !== v && c !== b && c !== m && c !== M && c !== j && c !== S && c !== A && c !== g && c !== x && c !== O && c !== _ && !Y(e.charCodeAt(e.length - 1));
                    if (t) for(o = 0; o < e.length; o++){
                        if (!R(a = e.charCodeAt(o))) return G;
                        s = 0 < o ? e.charCodeAt(o - 1) : null, d = d && B(a, s);
                    }
                    else {
                        for(o = 0; o < e.length; o++){
                            if ((a = e.charCodeAt(o)) === h) u = !0, p && (l = l || i < o - f - 1 && " " !== e[f + 1], f = o);
                            else if (!R(a)) return G;
                            s = 0 < o ? e.charCodeAt(o - 1) : null, d = d && B(a, s);
                        }
                        l = l || p && i < o - f - 1 && " " !== e[f + 1];
                    }
                    return u || l ? 9 < n && P(e) ? G : l ? H : $ : d && !r(e) ? W : K;
                }
                function Z(i, r, o, a) {
                    i.dump = function() {
                        if (0 === r.length) return "''";
                        if (!i.noCompatMode && -1 !== f.indexOf(r)) return "'" + r + "'";
                        var e = i.indent * Math.max(1, o), t = -1 === i.lineWidth ? -1 : Math.max(Math.min(i.lineWidth, 40), i.lineWidth - e), n = a || -1 < i.flowLevel && o >= i.flowLevel;
                        switch(V(r, n, i.indent, t, function(e) {
                            return function(e, t) {
                                for(var n = 0, i = e.implicitTypes.length; n < i; n += 1)if (e.implicitTypes[n].resolve(t)) return !0;
                                return !1;
                            }(i, e);
                        })){
                            case W:
                                return r;
                            case K:
                                return "'" + r.replace(/'/g, "''") + "'";
                            case $:
                                return "|" + z(r, i.indent) + J(U(r, e));
                            case H:
                                return ">" + z(r, i.indent) + J(U(function(t, n) {
                                    var e, i, r = /(\n+)([^\n]*)/g, o = function() {
                                        var e = -1 !== (e = t.indexOf("\n")) ? e : t.length;
                                        return r.lastIndex = e, Q(t.slice(0, e), n);
                                    }(), a = "\n" === t[0] || " " === t[0];
                                    for(; i = r.exec(t);){
                                        var s = i[1], c = i[2];
                                        e = " " === c[0], o += s + (a || e || "" === c ? "" : "\n") + Q(c, n), a = e;
                                    }
                                    return o;
                                }(r, t), e));
                            case G:
                                return '"' + function(e) {
                                    for(var t, n, i, r = "", o = 0; o < e.length; o++)55296 <= (t = e.charCodeAt(o)) && t <= 56319 && 56320 <= (n = e.charCodeAt(o + 1)) && n <= 57343 ? (r += L(1024 * (t - 55296) + n - 56320 + 65536), o++) : (i = l[t], r += !i && R(t) ? e[o] : i || L(t));
                                    return r;
                                }(r) + '"';
                            default:
                                throw new d("impossible error: invalid scalar style");
                        }
                    }();
                }
                function z(e, t) {
                    var n = P(e) ? String(t) : "", i = "\n" === e[e.length - 1];
                    return n + (i && ("\n" === e[e.length - 2] || "\n" === e) ? "+" : i ? "" : "-") + "\n";
                }
                function J(e) {
                    return "\n" === e[e.length - 1] ? e.slice(0, -1) : e;
                }
                function Q(e, t) {
                    if ("" === e || " " === e[0]) return e;
                    for(var n, i, r = / [^ ]/g, o = 0, a = 0, s = 0, c = ""; n = r.exec(e);)t < (s = n.index) - o && (i = o < a ? a : s, c += "\n" + e.slice(o, i), o = i + 1), a = s;
                    return c += "\n", e.length - o > t && o < a ? c += e.slice(o, a) + "\n" + e.slice(a + 1) : c += e.slice(o), c.slice(1);
                }
                function X(e, t, n) {
                    for(var i, r, o, a = n ? e.explicitTypes : e.implicitTypes, s = 0, c = a.length; s < c; s += 1)if (((r = a[s]).instanceOf || r.predicate) && (!r.instanceOf || "object" == typeof t && t instanceof r.instanceOf) && (!r.predicate || r.predicate(t))) {
                        if (e.tag = n ? r.tag : "?", r.represent) {
                            if (o = e.styleMap[r.tag] || r.defaultStyle, "[object Function]" === p.call(r.represent)) i = r.represent(t, o);
                            else {
                                if (!u.call(r.represent, o)) throw new d("!<" + r.tag + '> tag resolver accepts not "' + o + '" style');
                                i = r.represent[o](t, o);
                            }
                            e.dump = i;
                        }
                        return 1;
                    }
                }
                function ee(e, t, n, i, r, o) {
                    e.tag = null, e.dump = n, X(e, n, !1) || X(e, n, !0);
                    var a = p.call(e.dump);
                    i = i && (e.flowLevel < 0 || e.flowLevel > t);
                    var s, c, u = "[object Object]" === a || "[object Array]" === a;
                    if (u && (c = -1 !== (s = e.duplicates.indexOf(n))), (null !== e.tag && "?" !== e.tag || c || 2 !== e.indent && 0 < t) && (r = !1), c && e.usedDuplicates[s]) e.dump = "*ref_" + s;
                    else {
                        if (u && c && !e.usedDuplicates[s] && (e.usedDuplicates[s] = !0), "[object Object]" === a) i && 0 !== Object.keys(e.dump).length ? (function(e, t, n, i) {
                            var r, o, a, s, c, u, l = "", p = e.tag, f = Object.keys(n);
                            if (!0 === e.sortKeys) f.sort();
                            else if ("function" == typeof e.sortKeys) f.sort(e.sortKeys);
                            else if (e.sortKeys) throw new d("sortKeys must be a boolean or a function");
                            for(r = 0, o = f.length; r < o; r += 1)u = "", i && 0 === r || (u += q(e, t)), s = n[a = f[r]], ee(e, t + 1, a, !0, !0, !0) && ((c = null !== e.tag && "?" !== e.tag || e.dump && 1024 < e.dump.length) && (e.dump && h === e.dump.charCodeAt(0) ? u += "?" : u += "? "), u += e.dump, c && (u += q(e, t)), ee(e, t + 1, s, !0, c) && (e.dump && h === e.dump.charCodeAt(0) ? u += ":" : u += ": ", l += u += e.dump));
                            e.tag = p, e.dump = l || "{}";
                        }(e, t, e.dump, r), c && (e.dump = "&ref_" + s + e.dump)) : (function(e, t, n) {
                            for(var i, r, o, a = "", s = e.tag, c = Object.keys(n), u = 0, l = c.length; u < l; u += 1)o = "", 0 !== u && (o += ", "), e.condenseFlow && (o += '"'), r = n[i = c[u]], ee(e, t, i, !1, !1) && (1024 < e.dump.length && (o += "? "), o += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), ee(e, t, r, !1, !1) && (a += o += e.dump));
                            e.tag = s, e.dump = "{" + a + "}";
                        }(e, t, e.dump), c && (e.dump = "&ref_" + s + " " + e.dump));
                        else if ("[object Array]" === a) {
                            var l = e.noArrayIndent && 0 < t ? t - 1 : t;
                            i && 0 !== e.dump.length ? (function(e, t, n, i) {
                                for(var r = "", o = e.tag, a = 0, s = n.length; a < s; a += 1)ee(e, t + 1, n[a], !0, !0) && (i && 0 === a || (r += q(e, t)), e.dump && h === e.dump.charCodeAt(0) ? r += "-" : r += "- ", r += e.dump);
                                e.tag = o, e.dump = r || "[]";
                            }(e, l, e.dump, r), c && (e.dump = "&ref_" + s + e.dump)) : (function(e, t, n) {
                                for(var i = "", r = e.tag, o = 0, a = n.length; o < a; o += 1)ee(e, t, n[o], !1, !1) && (0 !== o && (i += "," + (e.condenseFlow ? "" : " ")), i += e.dump);
                                e.tag = r, e.dump = "[" + i + "]";
                            }(e, l, e.dump), c && (e.dump = "&ref_" + s + " " + e.dump));
                        } else {
                            if ("[object String]" !== a) {
                                if (e.skipInvalid) return;
                                throw new d("unacceptable kind of an object to dump " + a);
                            }
                            "?" !== e.tag && Z(e, e.dump, t, o);
                        }
                        null !== e.tag && "?" !== e.tag && (e.dump = "!<" + e.tag + "> " + e.dump);
                    }
                    return 1;
                }
                function te(e, t) {
                    var n, i, r = [], o = [];
                    for(!function e(t, n, i) {
                        var r, o, a;
                        if (null !== t && "object" == typeof t) if (-1 !== (o = n.indexOf(t))) -1 === i.indexOf(o) && i.push(o);
                        else if (n.push(t), Array.isArray(t)) for(o = 0, a = t.length; o < a; o += 1)e(t[o], n, i);
                        else for(r = Object.keys(t), o = 0, a = r.length; o < a; o += 1)e(t[r[o]], n, i);
                    }(e, r, o), n = 0, i = o.length; n < i; n += 1)t.duplicates.push(r[o[n]]);
                    t.usedDuplicates = new Array(i);
                }
                function ne(e, t) {
                    var n = new D(t = t || {});
                    return n.noRefs || te(e, n), ee(n, 0, e, !0, !0) ? n.dump + "\n" : "";
                }
                t.exports.dump = ne, t.exports.safeDump = function(e, t) {
                    return ne(e, c.extend({
                        schema: r
                    }, t));
                };
            },
            {
                "./common": 2,
                "./exception": 4,
                "./schema/default_full": 9,
                "./schema/default_safe": 10
            }
        ],
        4: [
            function(e, t, n) {
                "use strict";
                function i(e, t) {
                    Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = (this.reason || "(unknown reason)") + (this.mark ? " " + this.mark.toString() : ""), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack || "";
                }
                ((i.prototype = Object.create(Error.prototype)).constructor = i).prototype.toString = function(e) {
                    var t = this.name + ": ";
                    return t += this.reason || "(unknown reason)", !e && this.mark && (t += " " + this.mark.toString()), t;
                }, t.exports = i;
            },
            {}
        ],
        5: [
            function(e, t, n) {
                "use strict";
                var g = e("./common"), i = e("./exception"), r = e("./mark"), o = e("./schema/default_safe"), a = e("./schema/default_full"), y = Object.prototype.hasOwnProperty, x = 1, v = 2, A = 3, b = 4, w = 1, C = 2, k = 3, c = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, s = /[\x85\u2028\u2029]/, j = /[,\[\]\{\}]/, S = /^(?:!|!!|![a-z\-]+!)$/i, I = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
                function l(e) {
                    return Object.prototype.toString.call(e);
                }
                function O(e) {
                    return 10 === e || 13 === e;
                }
                function E(e) {
                    return 9 === e || 32 === e;
                }
                function F(e) {
                    return 9 === e || 32 === e || 10 === e || 13 === e;
                }
                function _(e) {
                    return 44 === e || 91 === e || 93 === e || 123 === e || 125 === e;
                }
                function u(e) {
                    return 48 === e ? "\0" : 97 === e ? "" : 98 === e ? "\b" : 116 === e || 9 === e ? "\t" : 110 === e ? "\n" : 118 === e ? "\v" : 102 === e ? "\f" : 114 === e ? "\r" : 101 === e ? "" : 32 === e ? " " : 34 === e ? '"' : 47 === e ? "/" : 92 === e ? "\\" : 78 === e ? "" : 95 === e ? " " : 76 === e ? "\u2028" : 80 === e ? "\u2029" : "";
                }
                for(var f = new Array(256), d = new Array(256), p = 0; p < 256; p++)f[p] = u(p) ? 1 : 0, d[p] = u(p);
                function h(e, t) {
                    this.input = e, this.filename = t.filename || null, this.schema = t.schema || a, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.documents = [];
                }
                function m(e, t) {
                    return new i(t, new r(e.filename, e.input, e.position, e.line, e.position - e.lineStart));
                }
                function N(e, t) {
                    throw m(e, t);
                }
                function M(e, t) {
                    e.onWarning && e.onWarning.call(null, m(e, t));
                }
                var T = {
                    YAML: function(e, t, n) {
                        var i, r, o;
                        null !== e.version && N(e, "duplication of %YAML directive"), 1 !== n.length && N(e, "YAML directive accepts exactly one argument"), null === (i = /^([0-9]+)\.([0-9]+)$/.exec(n[0])) && N(e, "ill-formed argument of the YAML directive"), r = parseInt(i[1], 10), o = parseInt(i[2], 10), 1 !== r && N(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = o < 2, 1 !== o && 2 !== o && M(e, "unsupported YAML version of the document");
                    },
                    TAG: function(e, t, n) {
                        var i, r;
                        2 !== n.length && N(e, "TAG directive accepts exactly two arguments"), i = n[0], r = n[1], S.test(i) || N(e, "ill-formed tag handle (first argument) of the TAG directive"), y.call(e.tagMap, i) && N(e, 'there is a previously declared suffix for "' + i + '" tag handle'), I.test(r) || N(e, "ill-formed tag prefix (second argument) of the TAG directive"), e.tagMap[i] = r;
                    }
                };
                function L(e, t, n, i) {
                    var r, o, a, s;
                    if (t < n) {
                        if (s = e.input.slice(t, n), i) for(r = 0, o = s.length; r < o; r += 1)9 === (a = s.charCodeAt(r)) || 32 <= a && a <= 1114111 || N(e, "expected valid JSON character");
                        else c.test(s) && N(e, "the stream contains non-printable characters");
                        e.result += s;
                    }
                }
                function D(e, t, n, i) {
                    var r, o, a, s;
                    for(g.isObject(n) || N(e, "cannot merge mappings; the provided source object is unacceptable"), a = 0, s = (r = Object.keys(n)).length; a < s; a += 1)o = r[a], y.call(t, o) || (t[o] = n[o], i[o] = !0);
                }
                function U(e, t, n, i, r, o, a, s) {
                    var c, u;
                    if (Array.isArray(r)) for(c = 0, u = (r = Array.prototype.slice.call(r)).length; c < u; c += 1)Array.isArray(r[c]) && N(e, "nested arrays are not supported inside keys"), "object" == typeof r && "[object Object]" === l(r[c]) && (r[c] = "[object Object]");
                    if ("object" == typeof r && "[object Object]" === l(r) && (r = "[object Object]"), r = String(r), null === t && (t = {}), "tag:yaml.org,2002:merge" === i) if (Array.isArray(o)) for(c = 0, u = o.length; c < u; c += 1)D(e, t, o[c], n);
                    else D(e, t, o, n);
                    else e.json || y.call(n, r) || !y.call(t, r) || (e.line = a || e.line, e.position = s || e.position, N(e, "duplicated mapping key")), t[r] = o, delete n[r];
                    return t;
                }
                function q(e) {
                    var t = e.input.charCodeAt(e.position);
                    10 === t ? e.position++ : 13 === t ? (e.position++, 10 === e.input.charCodeAt(e.position) && e.position++) : N(e, "a line break is expected"), e.line += 1, e.lineStart = e.position;
                }
                function Y(e, t, n) {
                    for(var i = 0, r = e.input.charCodeAt(e.position); 0 !== r;){
                        for(; E(r);)r = e.input.charCodeAt(++e.position);
                        if (t && 35 === r) for(; 10 !== (r = e.input.charCodeAt(++e.position)) && 13 !== r && 0 !== r;);
                        if (!O(r)) break;
                        for(q(e), r = e.input.charCodeAt(e.position), i++, e.lineIndent = 0; 32 === r;)e.lineIndent++, r = e.input.charCodeAt(++e.position);
                    }
                    return -1 !== n && 0 !== i && e.lineIndent < n && M(e, "deficient indentation"), i;
                }
                function R(e) {
                    var t = e.position, n = e.input.charCodeAt(t);
                    return 45 !== n && 46 !== n || n !== e.input.charCodeAt(t + 1) || n !== e.input.charCodeAt(t + 2) || (t += 3, 0 !== (n = e.input.charCodeAt(t)) && !F(n)) ? void 0 : 1;
                }
                function B(e, t) {
                    1 === t ? e.result += " " : 1 < t && (e.result += g.repeat("\n", t - 1));
                }
                function P(e, t) {
                    var n, i, r, o, a, s, c, u, l, p = e.input.charCodeAt(e.position);
                    if (34 === p) {
                        for(e.kind = "scalar", e.result = "", e.position++, n = i = e.position; 0 !== (p = e.input.charCodeAt(e.position));){
                            if (34 === p) return L(e, n, e.position, !0), e.position++, 1;
                            if (92 === p) {
                                if (L(e, n, e.position, !0), O(p = e.input.charCodeAt(++e.position))) Y(e, !1, t);
                                else if (p < 256 && f[p]) e.result += d[p], e.position++;
                                else if (0 < (a = 120 === (l = p) ? 2 : 117 === l ? 4 : 85 === l ? 8 : 0)) {
                                    for(r = a, o = 0; 0 < r; r--)p = e.input.charCodeAt(++e.position), u = void 0, 0 <= (a = 48 <= (c = p) && c <= 57 ? c - 48 : 97 <= (u = 32 | c) && u <= 102 ? u - 97 + 10 : -1) ? o = (o << 4) + a : N(e, "expected hexadecimal character");
                                    e.result += (s = o) <= 65535 ? String.fromCharCode(s) : String.fromCharCode(55296 + (s - 65536 >> 10), 56320 + (s - 65536 & 1023)), e.position++;
                                } else N(e, "unknown escape sequence");
                                n = i = e.position;
                            } else O(p) ? (L(e, n, i, !0), B(e, Y(e, !1, t)), n = i = e.position) : e.position === e.lineStart && R(e) ? N(e, "unexpected end of the document within a double quoted scalar") : (e.position++, i = e.position);
                        }
                        N(e, "unexpected end of the stream within a double quoted scalar");
                    }
                }
                function W(e, t) {
                    var n, i, r = e.tag, o = e.anchor, a = [], s = !1;
                    for(null !== e.anchor && (e.anchorMap[e.anchor] = a), i = e.input.charCodeAt(e.position); 0 !== i && 45 === i && F(e.input.charCodeAt(e.position + 1));)if (s = !0, e.position++, Y(e, !0, -1) && e.lineIndent <= t) a.push(null), i = e.input.charCodeAt(e.position);
                    else if (n = e.line, K(e, t, A, !1, !0), a.push(e.result), Y(e, !0, -1), i = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && 0 !== i) N(e, "bad indentation of a sequence entry");
                    else if (e.lineIndent < t) break;
                    return !!s && (e.tag = r, e.anchor = o, e.kind = "sequence", e.result = a, !0);
                }
                function K(e, t, n, i, r) {
                    var o, a, s, c, u, l, p, f, d = 1, h = !1, m = !1;
                    if (null !== e.listener && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = b === n || A === n, i && Y(e, !0, -1) && (h = !0, e.lineIndent > t ? d = 1 : e.lineIndent === t ? d = 0 : e.lineIndent < t && (d = -1)), 1 === d) for(; function(e) {
                        var t, n, i, r = !1, o = !1, a = e.input.charCodeAt(e.position);
                        if (33 === a) {
                            if (null !== e.tag && N(e, "duplication of a tag property"), 60 === (a = e.input.charCodeAt(++e.position)) ? (r = !0, a = e.input.charCodeAt(++e.position)) : 33 === a ? (o = !0, n = "!!", a = e.input.charCodeAt(++e.position)) : n = "!", t = e.position, r) {
                                for(; 0 !== (a = e.input.charCodeAt(++e.position)) && 62 !== a;);
                                e.position < e.length ? (i = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : N(e, "unexpected end of the stream within a verbatim tag");
                            } else {
                                for(; 0 !== a && !F(a);)33 === a && (o ? N(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(t - 1, e.position + 1), S.test(n) || N(e, "named tag handle cannot contain such characters"), o = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
                                i = e.input.slice(t, e.position), j.test(i) && N(e, "tag suffix cannot contain flow indicator characters");
                            }
                            return i && !I.test(i) && N(e, "tag name cannot contain such characters: " + i), r ? e.tag = i : y.call(e.tagMap, n) ? e.tag = e.tagMap[n] + i : "!" === n ? e.tag = "!" + i : "!!" === n ? e.tag = "tag:yaml.org,2002:" + i : N(e, 'undeclared tag handle "' + n + '"'), 1;
                        }
                    }(e) || function(e) {
                        var t, n = e.input.charCodeAt(e.position);
                        if (38 === n) {
                            for(null !== e.anchor && N(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; 0 !== n && !F(n) && !_(n);)n = e.input.charCodeAt(++e.position);
                            return e.position === t && N(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), 1;
                        }
                    }(e);)Y(e, !0, -1) ? (h = !0, s = o, e.lineIndent > t ? d = 1 : e.lineIndent === t ? d = 0 : e.lineIndent < t && (d = -1)) : s = !1;
                    if (s = s && (h || r), 1 !== d && b !== n || (p = x === n || v === n ? t : t + 1, f = e.position - e.lineStart, 1 === d ? s && (W(e, f) || function(e, t, n) {
                        var i, r, o, a, s, c = e.tag, u = e.anchor, l = {}, p = {}, f = null, d = null, h = null, m = !1, g = !1;
                        for(null !== e.anchor && (e.anchorMap[e.anchor] = l), s = e.input.charCodeAt(e.position); 0 !== s;){
                            if (i = e.input.charCodeAt(e.position + 1), o = e.line, a = e.position, 63 !== s && 58 !== s || !F(i)) {
                                if (!K(e, n, v, !1, !0)) break;
                                if (e.line === o) {
                                    for(s = e.input.charCodeAt(e.position); E(s);)s = e.input.charCodeAt(++e.position);
                                    if (58 === s) F(s = e.input.charCodeAt(++e.position)) || N(e, "a whitespace character is expected after the key-value separator within a block mapping"), m && (U(e, l, p, f, d, null), f = d = h = null), r = m = !(g = !0), f = e.tag, d = e.result;
                                    else {
                                        if (!g) return e.tag = c, e.anchor = u, 1;
                                        N(e, "can not read an implicit mapping pair; a colon is missed");
                                    }
                                } else {
                                    if (!g) return e.tag = c, e.anchor = u, 1;
                                    N(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
                                }
                            } else 63 === s ? (m && (U(e, l, p, f, d, null), f = d = h = null), r = m = g = !0) : m ? r = !(m = !1) : N(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, s = i;
                            if ((e.line === o || e.lineIndent > t) && (K(e, t, b, !0, r) && (m ? d = e.result : h = e.result), m || (U(e, l, p, f, d, h, o, a), f = d = h = null), Y(e, !0, -1), s = e.input.charCodeAt(e.position)), e.lineIndent > t && 0 !== s) N(e, "bad indentation of a mapping entry");
                            else if (e.lineIndent < t) break;
                        }
                        return m && U(e, l, p, f, d, null), g && (e.tag = c, e.anchor = u, e.kind = "mapping", e.result = l), g;
                    }(e, f, p)) || function(e, t) {
                        var n, i, r, o, a, s, c, u, l, p = !0, f = e.tag, d = e.anchor, h = {}, m = e.input.charCodeAt(e.position);
                        if (91 === m) s = !(r = 93), i = [];
                        else {
                            if (123 !== m) return;
                            r = 125, s = !0, i = {};
                        }
                        for(null !== e.anchor && (e.anchorMap[e.anchor] = i), m = e.input.charCodeAt(++e.position); 0 !== m;){
                            if (Y(e, !0, t), (m = e.input.charCodeAt(e.position)) === r) return e.position++, e.tag = f, e.anchor = d, e.kind = s ? "mapping" : "sequence", e.result = i, 1;
                            p || N(e, "missed comma between flow collection entries"), l = null, o = a = !1, 63 === m && F(e.input.charCodeAt(e.position + 1)) && (o = a = !0, e.position++, Y(e, !0, t)), n = e.line, K(e, t, x, !1, !0), u = e.tag, c = e.result, Y(e, !0, t), m = e.input.charCodeAt(e.position), !a && e.line !== n || 58 !== m || (o = !0, m = e.input.charCodeAt(++e.position), Y(e, !0, t), K(e, t, x, !1, !0), l = e.result), s ? U(e, i, h, u, c, l) : o ? i.push(U(e, null, h, u, c, l)) : i.push(c), Y(e, !0, t), 44 === (m = e.input.charCodeAt(e.position)) ? (p = !0, m = e.input.charCodeAt(++e.position)) : p = !1;
                        }
                        N(e, "unexpected end of the stream within a flow collection");
                    }(e, p) ? m = !0 : (a && function(e, t) {
                        var n, i, r, o, a = w, s = !1, c = !1, u = t, l = 0, p = !1, f = e.input.charCodeAt(e.position);
                        if (124 === f) i = !1;
                        else {
                            if (62 !== f) return;
                            i = !0;
                        }
                        for(e.kind = "scalar", e.result = ""; 0 !== f;)if (43 === (f = e.input.charCodeAt(++e.position)) || 45 === f) w === a ? a = 43 === f ? k : C : N(e, "repeat of a chomping mode identifier");
                        else {
                            if (!(0 <= (r = 48 <= (o = f) && o <= 57 ? o - 48 : -1))) break;
                            0 == r ? N(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : c ? N(e, "repeat of an indentation width identifier") : (u = t + r - 1, c = !0);
                        }
                        if (E(f)) {
                            for(; E(f = e.input.charCodeAt(++e.position)););
                            if (35 === f) for(; !O(f = e.input.charCodeAt(++e.position)) && 0 !== f;);
                        }
                        for(; 0 !== f;){
                            for(q(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!c || e.lineIndent < u) && 32 === f;)e.lineIndent++, f = e.input.charCodeAt(++e.position);
                            if (!c && e.lineIndent > u && (u = e.lineIndent), O(f)) l++;
                            else {
                                if (e.lineIndent < u) {
                                    a === k ? e.result += g.repeat("\n", s ? 1 + l : l) : a === w && s && (e.result += "\n");
                                    break;
                                }
                                for(i ? E(f) ? (p = !0, e.result += g.repeat("\n", s ? 1 + l : l)) : p ? (p = !1, e.result += g.repeat("\n", l + 1)) : 0 === l ? s && (e.result += " ") : e.result += g.repeat("\n", l) : e.result += g.repeat("\n", s ? 1 + l : l), c = s = !0, l = 0, n = e.position; !O(f) && 0 !== f;)f = e.input.charCodeAt(++e.position);
                                L(e, n, e.position, !1);
                            }
                        }
                        return 1;
                    }(e, p) || function(e, t) {
                        var n, i, r = e.input.charCodeAt(e.position);
                        if (39 === r) {
                            for(e.kind = "scalar", e.result = "", e.position++, n = i = e.position; 0 !== (r = e.input.charCodeAt(e.position));)if (39 === r) {
                                if (L(e, n, e.position, !0), 39 !== (r = e.input.charCodeAt(++e.position))) return 1;
                                n = e.position, e.position++, i = e.position;
                            } else O(r) ? (L(e, n, i, !0), B(e, Y(e, !1, t)), n = i = e.position) : e.position === e.lineStart && R(e) ? N(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
                            N(e, "unexpected end of the stream within a single quoted scalar");
                        }
                    }(e, p) || P(e, p) ? m = !0 : !function(e) {
                        var t, n, i = e.input.charCodeAt(e.position);
                        if (42 === i) {
                            for(i = e.input.charCodeAt(++e.position), t = e.position; 0 !== i && !F(i) && !_(i);)i = e.input.charCodeAt(++e.position);
                            return e.position === t && N(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), e.anchorMap.hasOwnProperty(n) || N(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], Y(e, !0, -1), 1;
                        }
                    }(e) ? function(e, t, n) {
                        var i, r, o, a, s, c, u, l = e.kind, p = e.result, f = e.input.charCodeAt(e.position);
                        if (!F(f) && !_(f) && 35 !== f && 38 !== f && 42 !== f && 33 !== f && 124 !== f && 62 !== f && 39 !== f && 34 !== f && 37 !== f && 64 !== f && 96 !== f && (63 !== f && 45 !== f || !(F(i = e.input.charCodeAt(e.position + 1)) || n && _(i)))) {
                            for(e.kind = "scalar", e.result = "", r = o = e.position, a = !1; 0 !== f;){
                                if (58 === f) {
                                    if (F(i = e.input.charCodeAt(e.position + 1)) || n && _(i)) break;
                                } else if (35 === f) {
                                    if (F(e.input.charCodeAt(e.position - 1))) break;
                                } else {
                                    if (e.position === e.lineStart && R(e) || n && _(f)) break;
                                    if (O(f)) {
                                        if (s = e.line, c = e.lineStart, u = e.lineIndent, Y(e, !1, -1), e.lineIndent >= t) {
                                            a = !0, f = e.input.charCodeAt(e.position);
                                            continue;
                                        }
                                        e.position = o, e.line = s, e.lineStart = c, e.lineIndent = u;
                                        break;
                                    }
                                }
                                a && (L(e, r, o, !1), B(e, e.line - s), r = o = e.position, a = !1), E(f) || (o = e.position + 1), f = e.input.charCodeAt(++e.position);
                            }
                            if (L(e, r, o, !1), e.result) return 1;
                            e.kind = l, e.result = p;
                        }
                    }(e, p, x === n) && (m = !0, null === e.tag && (e.tag = "?")) : (m = !0, null === e.tag && null === e.anchor || N(e, "alias node should not have any properties")), null !== e.anchor && (e.anchorMap[e.anchor] = e.result)) : 0 === d && (m = s && W(e, f))), null !== e.tag && "!" !== e.tag) if ("?" === e.tag) {
                        for(null !== e.result && "scalar" !== e.kind && N(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), c = 0, u = e.implicitTypes.length; c < u; c += 1)if ((l = e.implicitTypes[c]).resolve(e.result)) {
                            e.result = l.construct(e.result), e.tag = l.tag, null !== e.anchor && (e.anchorMap[e.anchor] = e.result);
                            break;
                        }
                    } else y.call(e.typeMap[e.kind || "fallback"], e.tag) ? (l = e.typeMap[e.kind || "fallback"][e.tag], null !== e.result && l.kind !== e.kind && N(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + l.kind + '", not "' + e.kind + '"'), l.resolve(e.result) ? (e.result = l.construct(e.result), null !== e.anchor && (e.anchorMap[e.anchor] = e.result)) : N(e, "cannot resolve a node with !<" + e.tag + "> explicit tag")) : N(e, "unknown tag !<" + e.tag + ">");
                    return null !== e.listener && e.listener("close", e), null !== e.tag || null !== e.anchor || m;
                }
                function $(e, t) {
                    t = t || {}, 0 !== (e = String(e)).length && (10 !== e.charCodeAt(e.length - 1) && 13 !== e.charCodeAt(e.length - 1) && (e += "\n"), 65279 === e.charCodeAt(0) && (e = e.slice(1)));
                    var n = new h(e, t), i = e.indexOf("\0");
                    for(-1 !== i && (n.position = i, N(n, "null byte is not allowed in input")), n.input += "\0"; 32 === n.input.charCodeAt(n.position);)n.lineIndent += 1, n.position += 1;
                    for(; n.position < n.length - 1;)!function(e) {
                        var t, n, i, r, o = e.position, a = !1;
                        for(e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = {}, e.anchorMap = {}; 0 !== (r = e.input.charCodeAt(e.position)) && (Y(e, !0, -1), r = e.input.charCodeAt(e.position), !(0 < e.lineIndent || 37 !== r));){
                            for(a = !0, r = e.input.charCodeAt(++e.position), t = e.position; 0 !== r && !F(r);)r = e.input.charCodeAt(++e.position);
                            for(i = [], (n = e.input.slice(t, e.position)).length < 1 && N(e, "directive name must not be less than one character in length"); 0 !== r;){
                                for(; E(r);)r = e.input.charCodeAt(++e.position);
                                if (35 === r) {
                                    for(; 0 !== (r = e.input.charCodeAt(++e.position)) && !O(r););
                                    break;
                                }
                                if (O(r)) break;
                                for(t = e.position; 0 !== r && !F(r);)r = e.input.charCodeAt(++e.position);
                                i.push(e.input.slice(t, e.position));
                            }
                            0 !== r && q(e), y.call(T, n) ? T[n](e, n, i) : M(e, 'unknown document directive "' + n + '"');
                        }
                        Y(e, !0, -1), 0 === e.lineIndent && 45 === e.input.charCodeAt(e.position) && 45 === e.input.charCodeAt(e.position + 1) && 45 === e.input.charCodeAt(e.position + 2) ? (e.position += 3, Y(e, !0, -1)) : a && N(e, "directives end mark is expected"), K(e, e.lineIndent - 1, b, !1, !0), Y(e, !0, -1), e.checkLineBreaks && s.test(e.input.slice(o, e.position)) && M(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && R(e) ? 46 === e.input.charCodeAt(e.position) && (e.position += 3, Y(e, !0, -1)) : e.position < e.length - 1 && N(e, "end of the stream or a document separator is expected");
                    }(n);
                    return n.documents;
                }
                function H(e, t, n) {
                    null !== t && "object" == typeof t && void 0 === n && (n = t, t = null);
                    var i = $(e, n);
                    if ("function" != typeof t) return i;
                    for(var r = 0, o = i.length; r < o; r += 1)t(i[r]);
                }
                function G(e, t) {
                    var n = $(e, t);
                    if (0 !== n.length) {
                        if (1 === n.length) return n[0];
                        throw new i("expected a single document in the stream, but found more");
                    }
                }
                t.exports.loadAll = H, t.exports.load = G, t.exports.safeLoadAll = function(e, t, n) {
                    return "object" == typeof t && null !== t && void 0 === n && (n = t, t = null), H(e, t, g.extend({
                        schema: o
                    }, n));
                }, t.exports.safeLoad = function(e, t) {
                    return G(e, g.extend({
                        schema: o
                    }, t));
                };
            },
            {
                "./common": 2,
                "./exception": 4,
                "./mark": 6,
                "./schema/default_full": 9,
                "./schema/default_safe": 10
            }
        ],
        6: [
            function(e, t, n) {
                "use strict";
                var s = e("./common");
                function i(e, t, n, i, r) {
                    this.name = e, this.buffer = t, this.position = n, this.line = i, this.column = r;
                }
                i.prototype.getSnippet = function(e, t) {
                    var n, i, r, o, a;
                    if (!this.buffer) return null;
                    for(e = e || 4, t = t || 75, n = "", i = this.position; 0 < i && -1 === "\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(i - 1));)if (--i, this.position - i > t / 2 - 1) {
                        n = " ... ", i += 5;
                        break;
                    }
                    for(r = "", o = this.position; o < this.buffer.length && -1 === "\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(o));)if ((o += 1) - this.position > t / 2 - 1) {
                        r = " ... ", o -= 5;
                        break;
                    }
                    return a = this.buffer.slice(i, o), s.repeat(" ", e) + n + a + r + "\n" + s.repeat(" ", e + this.position - i + n.length) + "^";
                }, i.prototype.toString = function(e) {
                    var t, n = "";
                    return this.name && (n += 'in "' + this.name + '" '), n += "at line " + (this.line + 1) + ", column " + (this.column + 1), e || (t = this.getSnippet()) && (n += ":\n" + t), n;
                }, t.exports = i;
            },
            {
                "./common": 2
            }
        ],
        7: [
            function(e, t, n) {
                "use strict";
                var r = e("./common"), o = e("./exception"), a = e("./type");
                function s(e, t, i) {
                    var r = [];
                    return e.include.forEach(function(e) {
                        i = s(e, t, i);
                    }), e[t].forEach(function(n) {
                        i.forEach(function(e, t) {
                            e.tag === n.tag && e.kind === n.kind && r.push(t);
                        }), i.push(n);
                    }), i.filter(function(e, t) {
                        return -1 === r.indexOf(t);
                    });
                }
                function c(e) {
                    this.include = e.include || [], this.implicit = e.implicit || [], this.explicit = e.explicit || [], this.implicit.forEach(function(e) {
                        if (e.loadKind && "scalar" !== e.loadKind) throw new o("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
                    }), this.compiledImplicit = s(this, "implicit", []), this.compiledExplicit = s(this, "explicit", []), this.compiledTypeMap = function() {
                        var e, t, n = {
                            scalar: {},
                            sequence: {},
                            mapping: {},
                            fallback: {}
                        };
                        function i(e) {
                            n[e.kind][e.tag] = n.fallback[e.tag] = e;
                        }
                        for(e = 0, t = arguments.length; e < t; e += 1)arguments[e].forEach(i);
                        return n;
                    }(this.compiledImplicit, this.compiledExplicit);
                }
                c.DEFAULT = null, c.create = function(e, t) {
                    var n, i;
                    switch(arguments.length){
                        case 1:
                            n = c.DEFAULT, i = e;
                            break;
                        case 2:
                            n = e, i = t;
                            break;
                        default:
                            throw new o("Wrong number of arguments for Schema.create function");
                    }
                    if (n = r.toArray(n), i = r.toArray(i), !n.every(function(e) {
                        return e instanceof c;
                    })) throw new o("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");
                    if (!i.every(function(e) {
                        return e instanceof a;
                    })) throw new o("Specified list of YAML types (or a single Type object) contains a non-Type object.");
                    return new c({
                        include: n,
                        explicit: i
                    });
                }, t.exports = c;
            },
            {
                "./common": 2,
                "./exception": 4,
                "./type": 13
            }
        ],
        8: [
            function(e, t, n) {
                "use strict";
                var i = e("../schema");
                t.exports = new i({
                    include: [
                        e("./json")
                    ]
                });
            },
            {
                "../schema": 7,
                "./json": 12
            }
        ],
        9: [
            function(e, t, n) {
                "use strict";
                var i = e("../schema");
                t.exports = i.DEFAULT = new i({
                    include: [
                        e("./default_safe")
                    ],
                    explicit: [
                        e("../type/js/undefined"),
                        e("../type/js/regexp"),
                        e("../type/js/function")
                    ]
                });
            },
            {
                "../schema": 7,
                "../type/js/function": 18,
                "../type/js/regexp": 19,
                "../type/js/undefined": 20,
                "./default_safe": 10
            }
        ],
        10: [
            function(e, t, n) {
                "use strict";
                var i = e("../schema");
                t.exports = new i({
                    include: [
                        e("./core")
                    ],
                    implicit: [
                        e("../type/timestamp"),
                        e("../type/merge")
                    ],
                    explicit: [
                        e("../type/binary"),
                        e("../type/omap"),
                        e("../type/pairs"),
                        e("../type/set")
                    ]
                });
            },
            {
                "../schema": 7,
                "../type/binary": 14,
                "../type/merge": 22,
                "../type/omap": 24,
                "../type/pairs": 25,
                "../type/set": 27,
                "../type/timestamp": 29,
                "./core": 8
            }
        ],
        11: [
            function(e, t, n) {
                "use strict";
                var i = e("../schema");
                t.exports = new i({
                    explicit: [
                        e("../type/str"),
                        e("../type/seq"),
                        e("../type/map")
                    ]
                });
            },
            {
                "../schema": 7,
                "../type/map": 21,
                "../type/seq": 26,
                "../type/str": 28
            }
        ],
        12: [
            function(e, t, n) {
                "use strict";
                var i = e("../schema");
                t.exports = new i({
                    include: [
                        e("./failsafe")
                    ],
                    implicit: [
                        e("../type/null"),
                        e("../type/bool"),
                        e("../type/int"),
                        e("../type/float")
                    ]
                });
            },
            {
                "../schema": 7,
                "../type/bool": 15,
                "../type/float": 16,
                "../type/int": 17,
                "../type/null": 23,
                "./failsafe": 11
            }
        ],
        13: [
            function(e, t, n) {
                "use strict";
                var r = e("./exception"), o = [
                    "kind",
                    "resolve",
                    "construct",
                    "instanceOf",
                    "predicate",
                    "represent",
                    "defaultStyle",
                    "styleAliases"
                ], a = [
                    "scalar",
                    "sequence",
                    "mapping"
                ];
                t.exports = function(t, e) {
                    var n, i;
                    if (e = e || {}, Object.keys(e).forEach(function(e) {
                        if (-1 === o.indexOf(e)) throw new r('Unknown option "' + e + '" is met in definition of "' + t + '" YAML type.');
                    }), this.tag = t, this.kind = e.kind || null, this.resolve = e.resolve || function() {
                        return !0;
                    }, this.construct = e.construct || function(e) {
                        return e;
                    }, this.instanceOf = e.instanceOf || null, this.predicate = e.predicate || null, this.represent = e.represent || null, this.defaultStyle = e.defaultStyle || null, this.styleAliases = (n = e.styleAliases || null, i = {}, null !== n && Object.keys(n).forEach(function(t) {
                        n[t].forEach(function(e) {
                            i[String(e)] = t;
                        });
                    }), i), -1 === a.indexOf(this.kind)) throw new r('Unknown kind "' + this.kind + '" is specified for "' + t + '" YAML type.');
                };
            },
            {
                "./exception": 4
            }
        ],
        14: [
            function(e, t, n) {
                "use strict";
                try {
                    var c = e("buffer").Buffer;
                } catch (e1) {}
                var i = e("../type"), u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
                t.exports = new i("tag:yaml.org,2002:binary", {
                    kind: "scalar",
                    resolve: function(e) {
                        if (null === e) return !1;
                        for(var t, n = 0, i = e.length, r = u, o = 0; o < i; o++)if (!(64 < (t = r.indexOf(e.charAt(o))))) {
                            if (t < 0) return !1;
                            n += 6;
                        }
                        return n % 8 == 0;
                    },
                    construct: function(e) {
                        for(var t, n = e.replace(/[\r\n=]/g, ""), i = n.length, r = u, o = 0, a = [], s = 0; s < i; s++)s % 4 == 0 && s && (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(255 & o)), o = o << 6 | r.indexOf(n.charAt(s));
                        return 0 == (t = i % 4 * 6) ? (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(255 & o)) : 18 == t ? (a.push(o >> 10 & 255), a.push(o >> 2 & 255)) : 12 == t && a.push(o >> 4 & 255), c ? c.from ? c.from(a) : new c(a) : a;
                    },
                    predicate: function(e) {
                        return c && c.isBuffer(e);
                    },
                    represent: function(e) {
                        for(var t, n = "", i = 0, r = e.length, o = u, a = 0; a < r; a++)a % 3 == 0 && a && (n += o[i >> 18 & 63], n += o[i >> 12 & 63], n += o[i >> 6 & 63], n += o[63 & i]), i = (i << 8) + e[a];
                        return 0 == (t = r % 3) ? (n += o[i >> 18 & 63], n += o[i >> 12 & 63], n += o[i >> 6 & 63], n += o[63 & i]) : 2 == t ? (n += o[i >> 10 & 63], n += o[i >> 4 & 63], n += o[i << 2 & 63], n += o[64]) : 1 == t && (n += o[i >> 2 & 63], n += o[i << 4 & 63], n += o[64], n += o[64]), n;
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        15: [
            function(e, t, n) {
                "use strict";
                var i = e("../type");
                t.exports = new i("tag:yaml.org,2002:bool", {
                    kind: "scalar",
                    resolve: function(e) {
                        if (null === e) return !1;
                        var t = e.length;
                        return 4 === t && ("true" === e || "True" === e || "TRUE" === e) || 5 === t && ("false" === e || "False" === e || "FALSE" === e);
                    },
                    construct: function(e) {
                        return "true" === e || "True" === e || "TRUE" === e;
                    },
                    predicate: function(e) {
                        return "[object Boolean]" === Object.prototype.toString.call(e);
                    },
                    represent: {
                        lowercase: function(e) {
                            return e ? "true" : "false";
                        },
                        uppercase: function(e) {
                            return e ? "TRUE" : "FALSE";
                        },
                        camelcase: function(e) {
                            return e ? "True" : "False";
                        }
                    },
                    defaultStyle: "lowercase"
                });
            },
            {
                "../type": 13
            }
        ],
        16: [
            function(e, t, n) {
                "use strict";
                var i = e("../common"), r = e("../type"), o = new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
                var a = /^[-+]?[0-9]+e/;
                t.exports = new r("tag:yaml.org,2002:float", {
                    kind: "scalar",
                    resolve: function(e) {
                        return null !== e && !(!o.test(e) || "_" === e[e.length - 1]);
                    },
                    construct: function(e) {
                        var t, n = e.replace(/_/g, "").toLowerCase(), i = "-" === n[0] ? -1 : 1, r = [];
                        return 0 <= "+-".indexOf(n[0]) && (n = n.slice(1)), ".inf" === n ? 1 == i ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : ".nan" === n ? NaN : 0 <= n.indexOf(":") ? (n.split(":").forEach(function(e) {
                            r.unshift(parseFloat(e, 10));
                        }), n = 0, t = 1, r.forEach(function(e) {
                            n += e * t, t *= 60;
                        }), i * n) : i * parseFloat(n, 10);
                    },
                    predicate: function(e) {
                        return "[object Number]" === Object.prototype.toString.call(e) && (e % 1 != 0 || i.isNegativeZero(e));
                    },
                    represent: function(e, t) {
                        var n;
                        if (isNaN(e)) switch(t){
                            case "lowercase":
                                return ".nan";
                            case "uppercase":
                                return ".NAN";
                            case "camelcase":
                                return ".NaN";
                        }
                        else if (Number.POSITIVE_INFINITY === e) switch(t){
                            case "lowercase":
                                return ".inf";
                            case "uppercase":
                                return ".INF";
                            case "camelcase":
                                return ".Inf";
                        }
                        else if (Number.NEGATIVE_INFINITY === e) switch(t){
                            case "lowercase":
                                return "-.inf";
                            case "uppercase":
                                return "-.INF";
                            case "camelcase":
                                return "-.Inf";
                        }
                        else if (i.isNegativeZero(e)) return "-0.0";
                        return n = e.toString(10), a.test(n) ? n.replace("e", ".e") : n;
                    },
                    defaultStyle: "lowercase"
                });
            },
            {
                "../common": 2,
                "../type": 13
            }
        ],
        17: [
            function(e, t, n) {
                "use strict";
                var i = e("../common"), r = e("../type");
                t.exports = new r("tag:yaml.org,2002:int", {
                    kind: "scalar",
                    resolve: function(e) {
                        if (null === e) return !1;
                        var t, n, i, r, o = e.length, a = 0, s = !1;
                        if (!o) return !1;
                        if ("-" !== (t = e[a]) && "+" !== t || (t = e[++a]), "0" === t) {
                            if (a + 1 === o) return !0;
                            if ("b" === (t = e[++a])) {
                                for(a++; a < o; a++)if ("_" !== (t = e[a])) {
                                    if ("0" !== t && "1" !== t) return !1;
                                    s = !0;
                                }
                                return s && "_" !== t;
                            }
                            if ("x" === t) {
                                for(a++; a < o; a++)if ("_" !== (t = e[a])) {
                                    if (!(48 <= (i = e.charCodeAt(a)) && i <= 57 || 65 <= i && i <= 70 || 97 <= i && i <= 102)) return !1;
                                    s = !0;
                                }
                                return s && "_" !== t;
                            }
                            for(; a < o; a++)if ("_" !== (t = e[a])) {
                                if (!(48 <= (n = e.charCodeAt(a)) && n <= 55)) return !1;
                                s = !0;
                            }
                            return s && "_" !== t;
                        }
                        if ("_" === t) return !1;
                        for(; a < o; a++)if ("_" !== (t = e[a])) {
                            if (":" === t) break;
                            if (!(48 <= (r = e.charCodeAt(a)) && r <= 57)) return !1;
                            s = !0;
                        }
                        return !(!s || "_" === t) && (":" !== t || /^(:[0-5]?[0-9])+$/.test(e.slice(a)));
                    },
                    construct: function(e) {
                        var t, n, i = e, r = 1, o = [];
                        return -1 !== i.indexOf("_") && (i = i.replace(/_/g, "")), "-" !== (t = i[0]) && "+" !== t || ("-" === t && (r = -1), t = (i = i.slice(1))[0]), "0" === i ? 0 : "0" === t ? "b" === i[1] ? r * parseInt(i.slice(2), 2) : "x" === i[1] ? r * parseInt(i, 16) : r * parseInt(i, 8) : -1 !== i.indexOf(":") ? (i.split(":").forEach(function(e) {
                            o.unshift(parseInt(e, 10));
                        }), i = 0, n = 1, o.forEach(function(e) {
                            i += e * n, n *= 60;
                        }), r * i) : r * parseInt(i, 10);
                    },
                    predicate: function(e) {
                        return "[object Number]" === Object.prototype.toString.call(e) && e % 1 == 0 && !i.isNegativeZero(e);
                    },
                    represent: {
                        binary: function(e) {
                            return 0 <= e ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
                        },
                        octal: function(e) {
                            return 0 <= e ? "0" + e.toString(8) : "-0" + e.toString(8).slice(1);
                        },
                        decimal: function(e) {
                            return e.toString(10);
                        },
                        hexadecimal: function(e) {
                            return 0 <= e ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
                        }
                    },
                    defaultStyle: "decimal",
                    styleAliases: {
                        binary: [
                            2,
                            "bin"
                        ],
                        octal: [
                            8,
                            "oct"
                        ],
                        decimal: [
                            10,
                            "dec"
                        ],
                        hexadecimal: [
                            16,
                            "hex"
                        ]
                    }
                });
            },
            {
                "../common": 2,
                "../type": 13
            }
        ],
        18: [
            function(e, t, n) {
                "use strict";
                try {
                    var o = e("esprima");
                } catch (e1) {
                    "undefined" != typeof window && (o = window.esprima);
                }
                var i = e("../../type");
                t.exports = new i("tag:yaml.org,2002:js/function", {
                    kind: "scalar",
                    resolve: function(e) {
                        if (null === e) return !1;
                        try {
                            var t = "(" + e + ")", n = o.parse(t, {
                                range: !0
                            });
                            return "Program" !== n.type || 1 !== n.body.length || "ExpressionStatement" !== n.body[0].type || "ArrowFunctionExpression" !== n.body[0].expression.type && "FunctionExpression" !== n.body[0].expression.type ? !1 : !0;
                        } catch (e1) {
                            return !1;
                        }
                    },
                    construct: function(e) {
                        var t, n = "(" + e + ")", i = o.parse(n, {
                            range: !0
                        }), r = [];
                        if ("Program" !== i.type || 1 !== i.body.length || "ExpressionStatement" !== i.body[0].type || "ArrowFunctionExpression" !== i.body[0].expression.type && "FunctionExpression" !== i.body[0].expression.type) throw new Error("Failed to resolve function");
                        return i.body[0].expression.params.forEach(function(e) {
                            r.push(e.name);
                        }), t = i.body[0].expression.body.range, "BlockStatement" === i.body[0].expression.body.type ? new Function(r, n.slice(t[0] + 1, t[1] - 1)) : new Function(r, "return " + n.slice(t[0], t[1]));
                    },
                    predicate: function(e) {
                        return "[object Function]" === Object.prototype.toString.call(e);
                    },
                    represent: function(e) {
                        return e.toString();
                    }
                });
            },
            {
                "../../type": 13
            }
        ],
        19: [
            function(e, t, n) {
                "use strict";
                var i = e("../../type");
                t.exports = new i("tag:yaml.org,2002:js/regexp", {
                    kind: "scalar",
                    resolve: function(e) {
                        if (null === e) return !1;
                        if (0 === e.length) return !1;
                        var t = e, n = /\/([gim]*)$/.exec(e), i = "";
                        if ("/" === t[0]) {
                            if (n && (i = n[1]), 3 < i.length) return !1;
                            if ("/" !== t[t.length - i.length - 1]) return !1;
                        }
                        return !0;
                    },
                    construct: function(e) {
                        var t = e, n = /\/([gim]*)$/.exec(e), i = "";
                        return "/" === t[0] && (n && (i = n[1]), t = t.slice(1, t.length - i.length - 1)), new RegExp(t, i);
                    },
                    predicate: function(e) {
                        return "[object RegExp]" === Object.prototype.toString.call(e);
                    },
                    represent: function(e) {
                        var t = "/" + e.source + "/";
                        return e.global && (t += "g"), e.multiline && (t += "m"), e.ignoreCase && (t += "i"), t;
                    }
                });
            },
            {
                "../../type": 13
            }
        ],
        20: [
            function(e, t, n) {
                "use strict";
                var i = e("../../type");
                t.exports = new i("tag:yaml.org,2002:js/undefined", {
                    kind: "scalar",
                    resolve: function() {
                        return !0;
                    },
                    construct: function() {},
                    predicate: function(e) {
                        return void 0 === e;
                    },
                    represent: function() {
                        return "";
                    }
                });
            },
            {
                "../../type": 13
            }
        ],
        21: [
            function(e, t, n) {
                "use strict";
                var i = e("../type");
                t.exports = new i("tag:yaml.org,2002:map", {
                    kind: "mapping",
                    construct: function(e) {
                        return null !== e ? e : {};
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        22: [
            function(e, t, n) {
                "use strict";
                var i = e("../type");
                t.exports = new i("tag:yaml.org,2002:merge", {
                    kind: "scalar",
                    resolve: function(e) {
                        return "<<" === e || null === e;
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        23: [
            function(e, t, n) {
                "use strict";
                var i = e("../type");
                t.exports = new i("tag:yaml.org,2002:null", {
                    kind: "scalar",
                    resolve: function(e) {
                        if (null === e) return !0;
                        var t = e.length;
                        return 1 === t && "~" === e || 4 === t && ("null" === e || "Null" === e || "NULL" === e);
                    },
                    construct: function() {
                        return null;
                    },
                    predicate: function(e) {
                        return null === e;
                    },
                    represent: {
                        canonical: function() {
                            return "~";
                        },
                        lowercase: function() {
                            return "null";
                        },
                        uppercase: function() {
                            return "NULL";
                        },
                        camelcase: function() {
                            return "Null";
                        }
                    },
                    defaultStyle: "lowercase"
                });
            },
            {
                "../type": 13
            }
        ],
        24: [
            function(e, t, n) {
                "use strict";
                var i = e("../type"), c = Object.prototype.hasOwnProperty, u = Object.prototype.toString;
                t.exports = new i("tag:yaml.org,2002:omap", {
                    kind: "sequence",
                    resolve: function(e) {
                        if (null === e) return !0;
                        for(var t, n, i, r = [], o = e, a = 0, s = o.length; a < s; a += 1){
                            if (t = o[a], i = !1, "[object Object]" !== u.call(t)) return !1;
                            for(n in t)if (c.call(t, n)) {
                                if (i) return !1;
                                i = !0;
                            }
                            if (!i) return !1;
                            if (-1 !== r.indexOf(n)) return !1;
                            r.push(n);
                        }
                        return !0;
                    },
                    construct: function(e) {
                        return null !== e ? e : [];
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        25: [
            function(e, t, n) {
                "use strict";
                var i = e("../type"), s = Object.prototype.toString;
                t.exports = new i("tag:yaml.org,2002:pairs", {
                    kind: "sequence",
                    resolve: function(e) {
                        if (null === e) return !0;
                        for(var t, n, i = e, r = new Array(i.length), o = 0, a = i.length; o < a; o += 1){
                            if (t = i[o], "[object Object]" !== s.call(t)) return !1;
                            if (1 !== (n = Object.keys(t)).length) return !1;
                            r[o] = [
                                n[0],
                                t[n[0]]
                            ];
                        }
                        return !0;
                    },
                    construct: function(e) {
                        if (null === e) return [];
                        for(var t, n, i = e, r = new Array(i.length), o = 0, a = i.length; o < a; o += 1)t = i[o], n = Object.keys(t), r[o] = [
                            n[0],
                            t[n[0]]
                        ];
                        return r;
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        26: [
            function(e, t, n) {
                "use strict";
                var i = e("../type");
                t.exports = new i("tag:yaml.org,2002:seq", {
                    kind: "sequence",
                    construct: function(e) {
                        return null !== e ? e : [];
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        27: [
            function(e, t, n) {
                "use strict";
                var i = e("../type"), r = Object.prototype.hasOwnProperty;
                t.exports = new i("tag:yaml.org,2002:set", {
                    kind: "mapping",
                    resolve: function(e) {
                        if (null === e) return !0;
                        var t, n = e;
                        for(t in n)if (r.call(n, t) && null !== n[t]) return !1;
                        return !0;
                    },
                    construct: function(e) {
                        return null !== e ? e : {};
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        28: [
            function(e, t, n) {
                "use strict";
                var i = e("../type");
                t.exports = new i("tag:yaml.org,2002:str", {
                    kind: "scalar",
                    construct: function(e) {
                        return null !== e ? e : "";
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        29: [
            function(e, t, n) {
                "use strict";
                var i = e("../type"), p = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), f = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
                t.exports = new i("tag:yaml.org,2002:timestamp", {
                    kind: "scalar",
                    resolve: function(e) {
                        return null !== e && (null !== p.exec(e) || null !== f.exec(e));
                    },
                    construct: function(e) {
                        var t, n, i, r, o, a, s, c = 0, u = null, l = p.exec(e);
                        if (null === l && (l = f.exec(e)), null === l) throw new Error("Date resolve error");
                        if (t = +l[1], n = l[2] - 1, i = +l[3], !l[4]) return new Date(Date.UTC(t, n, i));
                        if (r = +l[4], o = +l[5], a = +l[6], l[7]) {
                            for(c = l[7].slice(0, 3); c.length < 3;)c += "0";
                            c = +c;
                        }
                        return l[9] && (u = 6e4 * (60 * +l[10] + +(l[11] || 0)), "-" === l[9] && (u = -u)), s = new Date(Date.UTC(t, n, i, r, o, a, c)), u && s.setTime(s.getTime() - u), s;
                    },
                    instanceOf: Date,
                    represent: function(e) {
                        return e.toISOString();
                    }
                });
            },
            {
                "../type": 13
            }
        ],
        "/": [
            function(e, t, n) {
                "use strict";
                var i = e("./lib/js-yaml.js");
                t.exports = i;
            },
            {
                "./lib/js-yaml.js": 1
            }
        ]
    }, {}, [])("/");
});
window.jsyaml.Type;
window.jsyaml.Schema;
window.jsyaml.FAILSAFE_SCHEMA;
window.jsyaml.JSON_SCHEMA;
window.jsyaml.CORE_SCHEMA;
window.jsyaml.DEFAULT_SAFE_SCHEMA;
window.jsyaml.DEFAULT_FULL_SCHEMA;
window.jsyaml.load;
window.jsyaml.loadAll;
window.jsyaml.safeLoad;
window.jsyaml.safeLoadAll;
let dump = window.jsyaml.dump;
window.jsyaml.safeDump;
window.jsyaml.YAMLException;
window.jsyaml.MINIMAL_SCHEMA;
window.jsyaml.SAFE_SCHEMA;
window.jsyaml.DEFAULT_SCHEMA;
window.jsyaml.scan;
window.jsyaml.parse;
window.jsyaml.compose;
window.jsyaml.addConstructor;
const statusCodes = new Map([
    [
        "OK",
        "200"
    ],
    [
        "CREATED",
        "201"
    ],
    [
        "NOT_FOUND",
        "400"
    ],
    [
        "DEFAULT",
        "default"
    ]
]);
var Types;
(function(Types) {
    Types["STRING"] = "string";
    Types["NUMBER"] = "number";
    Types["INTEGER"] = "integer";
    Types["BOOLEAN"] = "boolean";
    Types["ARRAY"] = "array";
    Types["FILE"] = "file";
    Types["OBJECT"] = "object";
})(Types || (Types = {}));
const removeEmpty = (obj)=>{
    if (typeof obj !== "object" && !Array.isArray(obj)) {
        return obj;
    }
    let newObj = {};
    Object.keys(obj).forEach((key)=>{
        if (obj[key]) {
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                const o = removeEmpty(obj[key]);
                if (Object.keys(o).length > 0) {
                    newObj[key] = o;
                }
            } else if (Array.isArray(obj[key])) {
                const ary = obj[key];
                if (ary.length > 0) {
                    let newAry = [];
                    ary.forEach((v)=>{
                        newAry.push(removeEmpty(v));
                    });
                    newObj[key] = newAry;
                }
            } else {
                newObj[key] = obj[key];
            }
        }
    });
    return newObj;
};
class OpenAPIV3Visitor extends BaseVisitor {
    root = {
        openapi: "3.0.3",
        tags: [],
        components: {},
        info: {
            title: "",
            version: ""
        },
        paths: {}
    };
    paths = {};
    schemas = {};
    path = "";
    method = "";
    operation;
    parameter;
    exposedTypes = new Set();
    constructor(writer){
        super(writer);
    }
    visitNamespaceBefore(context) {
        const ns = context.namespace;
        const visitor = new ExposedTypesVisitor(this.writer);
        ns.accept(context, visitor);
        this.exposedTypes = visitor.found;
    }
    visitNamespaceAfter(context) {
        const filename = context.config["$filename"];
        this.root.paths = this.paths;
        this.root.components = {
            schemas: this.schemas
        };
        const contents = removeEmpty(this.root);
        if (filename.toLowerCase().endsWith(".json")) {
            this.write(JSON.stringify(contents, null, 2));
        } else {
            this.write(dump(contents));
        }
    }
    visitNamespace(context) {
        const ns = context.namespace;
        ns.annotation("info", (a)=>{
            this.root.info = a.convert();
        });
        ns.annotation("externalDocs", (a)=>{
            this.root.externalDocs = a.convert();
        });
        ns.annotation("server", (a)=>{
            this.root.servers ||= [];
            this.root.servers?.push(a.convert());
        });
    }
    visitInterface(context) {
        if (!isService(context)) {
            return;
        }
        const { interface: iface  } = context;
        this.root.tags ||= [];
        this.root.tags.push({
            name: iface.name,
            description: iface.description
        });
    }
    visitOperationBefore(context) {
        if (!isService(context)) {
            return;
        }
        const { interface: iface , operation  } = context;
        const path = getPath(context);
        if (path == "") {
            return;
        }
        let pathItem = this.paths[path];
        if (!pathItem) {
            pathItem = {};
            this.paths[path] = pathItem;
        }
        let method = undefined;
        [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "HEAD",
            "OPTIONS"
        ].forEach((m)=>{
            operation.annotation(m, ()=>{
                method = m.toLowerCase();
            });
        });
        if (!method) {
            return;
        }
        method = method;
        let summary = operation.description;
        operation.annotation("summary", (a)=>{
            summary = a.convert().value;
        });
        this.path = path;
        this.method = method;
        this.operation = {
            operationId: operation.name,
            summary: summary,
            description: operation.description,
            responses: {},
            tags: [
                iface.name
            ]
        };
        operation.annotation("deprecated", (a)=>{
            this.operation.deprecated = true;
        });
        pathItem[method] = this.operation;
    }
    visitParameter(context) {
        if (!this.operation || !isService(context)) {
            return;
        }
        if (!this.operation.parameters) {
            this.operation.parameters = [];
        }
        const { operation , parameter  } = context;
        let paramIn;
        let required = true;
        let t = parameter.type;
        if (t.kind == Kind.Optional) {
            t = t.type;
            required = false;
        }
        if (this.path.indexOf(`{` + parameter.name + `}`) != -1) {
            paramIn = "path";
        } else if (parameter.annotation("query")) {
            paramIn = "query";
        } else if (parameter.annotation("header")) {
            paramIn = "header";
        } else if (parameter.annotation("cookie")) {
            paramIn = "cookie";
        } else {
            if (operation.isUnary()) {
                if (t.kind == Kind.Type || t.kind == Kind.Union || t.kind == Kind.Alias || t.kind == Kind.Enum) {
                    const type = t;
                    this.operation.requestBody = {
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/" + type.name
                                }
                            }
                        },
                        required: true
                    };
                } else if (t.kind == Kind.Primitive) {
                    const named = t;
                    const typeFormat = primitiveTypeMap.get(named.name);
                    if (!typeFormat) {
                        throw Error(`body parameter "${parameter.name}" must be a required type: found "${t.kind}"`);
                    }
                    this.operation.requestBody = {
                        content: {
                            "application/json": {
                                schema: {
                                    ...typeFormat
                                }
                            }
                        },
                        required: true
                    };
                    return;
                }
            } else {
                if (!this.operation.requestBody) {
                    this.operation.requestBody = {
                        content: {
                            "application/json": {
                                schema: {
                                    properties: {},
                                    required: []
                                }
                            }
                        },
                        required: true
                    };
                }
                const c = this.operation.requestBody;
                const content = c.content["application/json"].schema;
                if (t.kind == Kind.Type || t.kind == Kind.Union || t.kind == Kind.Alias || t.kind == Kind.Enum) {
                    const type1 = t;
                    content.properties[parameter.name] = {
                        $ref: "#/components/schemas/" + type1.name
                    };
                } else if (t.kind == Kind.Primitive) {
                    const named1 = t;
                    const typeFormat1 = primitiveTypeMap.get(named1.name);
                    if (!typeFormat1) {
                        throw Error(`body parameter "${parameter.name}" must be a required type: found "${t.kind}"`);
                    }
                    content.properties[parameter.name] = {
                        ...typeFormat1
                    };
                    if (required) {
                        content.required?.push(parameter.name);
                    }
                    return;
                }
            }
            return;
        }
        const p = {
            name: parameter.name,
            in: paramIn,
            description: parameter.description,
            required: required
        };
        if (t.kind == Kind.List) {}
        switch(paramIn){
            case "path":
                {
                    let typeFormat2 = undefined;
                    if (t.kind == Kind.Alias) {
                        t = t.type;
                    }
                    if (t.kind == Kind.Primitive) {
                        const named2 = t;
                        typeFormat2 = primitiveTypeMap.get(named2.name);
                    }
                    if (!typeFormat2) {
                        throw Error(`path parameter "${parameter.name}" must be a required type: found "${t.kind}"`);
                    }
                    this.operation.parameters.push({
                        ...p,
                        schema: {
                            ...typeFormat2
                        }
                    });
                    return;
                }
            case "query":
                switch(t.kind){
                    case Kind.List:
                        {
                            const list = t;
                            const type2 = list.type;
                            let typeFormat3 = undefined;
                            if (type2.kind == Kind.Primitive) {
                                const named3 = type2;
                                typeFormat3 = primitiveTypeMap.get(named3.name);
                            }
                            if (!typeFormat3) {
                                throw Error(`query parameter "${parameter.name}" must be a built-type: found "${type2.kind}"`);
                            }
                            this.operation.parameters.push({
                                ...p,
                                items: {
                                    ...typeFormat3
                                }
                            });
                            break;
                        }
                    case Kind.Primitive:
                        {
                            const named4 = t;
                            const primitive = primitiveTypeMap.get(named4.name);
                            if (primitive) {
                                this.operation.parameters.push({
                                    ...p,
                                    schema: {
                                        ...primitive
                                    }
                                });
                                return;
                            }
                            const typeDef = context.namespace.allTypes[named4.name];
                            if (typeDef && typeDef.kind == Kind.Type) {
                                const type3 = typeDef;
                                type3.fields.map((f)=>{
                                    const named = f.type;
                                    const primitive = primitiveTypeMap.get(named.name);
                                    if (primitive) {
                                        this.operation.parameters.push({
                                            name: f.name,
                                            in: "query",
                                            description: f.description,
                                            required: f.type.kind != Kind.Optional,
                                            schema: {
                                                ...primitive
                                            }
                                        });
                                    }
                                });
                                return;
                            }
                            throw Error(`query parameter "${parameter.name}" must be a built-type: found "${named4.name}"`);
                        }
                }
        }
        this.operation.parameters.push(p);
    }
    visitOperationAfter(context) {
        if (!this.operation || !isService(context)) {
            return;
        }
        const { operation  } = context;
        const responses = {};
        const responseDirectives = [];
        let found2xx = false;
        operation.annotations.map((a)=>{
            if (a.name != "response") {
                return;
            }
            const resp = a.convert();
            const code = statusCodes.get(resp.status) || "default";
            if (code.substring(0, 1) == "2") {
                found2xx = true;
            }
            responseDirectives.push(resp);
        });
        if (operation.type.kind == Kind.Void) {
            responses[204] = {
                description: "No Content"
            };
        } else if (!found2xx) {
            this.method == "post" ? "201" : "200";
            responses.default = {
                description: "Success",
                content: {
                    "application/json": {
                        schema: this.typeToSchema(operation.type)
                    }
                }
            };
        }
        responseDirectives.map((resp)=>{
            const code = statusCodes.get(resp.status) || "default";
            let type = operation.type;
            if (resp.returns) {
                type = context.namespace.types[resp.returns];
            }
            responses[code] = {
                description: resp.description || "Success",
                content: {
                    "application/json": {
                        schema: this.typeToSchema(type)
                    }
                }
            };
        });
        if (Object.keys(responses).length > 0) {
            this.operation.responses = responses;
        }
        this.path = "";
        this.operation = undefined;
    }
    visitType(context) {
        const { type  } = context;
        if (!this.exposedTypes.has(type.name)) {
            return;
        }
        const schema = {
            description: type.description,
            ...this.typeDefinitionToSchema(type)
        };
        this.schemas[type.name] = schema;
    }
    visitEnum(context) {
        const e = context.enum;
        if (!this.exposedTypes.has(e.name)) {
            return;
        }
        const schema = {
            type: Types.STRING,
            description: e.description,
            enum: e.values.map((ev)=>ev.display || ev.name)
        };
        this.schemas[e.name] = schema;
    }
    visitUnion(context) {
        const { union  } = context;
        const schema = {
            type: Types.OBJECT,
            description: union.description,
            properties: convertArrayToObject(union.types, (t)=>{
                switch(t.kind){
                    case Kind.Union:
                    case Kind.Type:
                    case Kind.Enum:
                        return t.name;
                    case Kind.Primitive:
                        return t.name;
                }
                return "unknown";
            }, this.typeToSchema)
        };
        this.schemas[union.name] = schema;
    }
    visitAlias(context) {
        const a = context.alias;
        const schema = this.typeToSchema(a);
        this.schemas[a.name] = schema;
    }
    typeDefinitionToSchema(type) {
        return {
            type: Types.OBJECT,
            description: type.description,
            properties: this.fieldsToDefinitions(type.fields),
            required: this.requestFieldList(type.fields)
        };
    }
    requestFieldList(fields) {
        const required = [];
        fields.map((f)=>{
            if (f.type.kind != Kind.Optional) {
                required.push(f.name);
            }
        });
        return required;
    }
    fieldsToDefinitions(fields) {
        const defs = {};
        fields.map((f)=>{
            defs[f.name] = {
                description: f.description,
                ...this.typeToSchema(f.type)
            };
        });
        return defs;
    }
    typeToSchema(type) {
        switch(type.kind){
            case Kind.Optional:
                {
                    const optional = type;
                    return this.typeToSchema(optional.type);
                }
            case Kind.Alias:
                {
                    const a = type;
                    return this.typeToSchema(a.type);
                }
            case Kind.Primitive:
                {
                    const prim = type;
                    const primitive = primitiveTypeMap.get(prim.name);
                    return {
                        ...primitive
                    };
                }
            case Kind.Union:
            case Kind.Enum:
            case Kind.Type:
                {
                    const named = type;
                    return {
                        $ref: "#/components/schemas/" + named.name
                    };
                }
            case Kind.List:
                {
                    const list = type;
                    return {
                        type: Types.ARRAY,
                        items: this.typeToSchema(list.type)
                    };
                }
            case Kind.Map:
                {
                    const map = type;
                    let valid = false;
                    if (map.keyType.kind == Kind.Primitive) {
                        valid = map.keyType.name == "string";
                    }
                    if (!valid) {
                        throw Error(`maps must have a key type of string`);
                    }
                    return {
                        type: Types.OBJECT,
                        additionalProperties: this.typeToSchema(map.valueType)
                    };
                }
            default:
                throw Error(`unexpected kind "${type.kind}"`);
        }
    }
}
const primitiveTypeMap = new Map([
    [
        "i8",
        {
            type: Types.INTEGER,
            format: "int32",
            minimum: -128,
            maximum: 127
        }
    ],
    [
        "i16",
        {
            type: Types.INTEGER,
            format: "int32",
            minimum: -32768,
            maximum: 32767
        }
    ],
    [
        "i32",
        {
            type: Types.INTEGER,
            format: "int32"
        }
    ],
    [
        "i64",
        {
            type: Types.INTEGER,
            format: "int64"
        }
    ],
    [
        "u8",
        {
            type: Types.INTEGER,
            format: "int32",
            minimum: 0,
            maximum: 255
        }
    ],
    [
        "u16",
        {
            type: Types.INTEGER,
            format: "int32",
            minimum: 0,
            maximum: 65535
        }
    ],
    [
        "u32",
        {
            type: Types.INTEGER,
            format: "int64",
            minimum: 0,
            maximum: 4294967295
        }
    ],
    [
        "u64",
        {
            type: Types.INTEGER,
            format: "int64",
            minimum: 0
        }
    ],
    [
        "f32",
        {
            type: Types.NUMBER,
            format: "float"
        }
    ],
    [
        "f64",
        {
            type: Types.NUMBER,
            format: "double"
        }
    ],
    [
        "string",
        {
            type: Types.STRING
        }
    ],
    [
        "bytes",
        {
            type: Types.STRING,
            format: "byte"
        }
    ],
    [
        "boolean",
        {
            type: Types.BOOLEAN
        }
    ],
    [
        "date",
        {
            type: Types.STRING,
            format: "date"
        }
    ],
    [
        "datetime",
        {
            type: Types.STRING,
            format: "date-time"
        }
    ],
    [
        "any",
        {}
    ],
    [
        "value",
        {}
    ]
]);
const mod5 = {
    default: OpenAPIV3Visitor,
    OpenAPIV3Visitor
};
function shouldIncludeHandler(context) {
    const { interface: iface  } = context;
    return iface.annotation("service") != undefined;
}
class ProtoVisitor extends BaseVisitor {
    requestTypes = new Array();
    exposedTypes = new Set();
    valueTypes = new Set();
    visitNamespaceBefore(context) {
        const ns = context.namespace;
        const exposedTypes = new ExposedTypesVisitor(this.writer);
        ns.accept(context, exposedTypes);
        this.exposedTypes = exposedTypes.found;
        const wrapperTypes = new WrapperTypesVisitor(this.writer);
        ns.accept(context, wrapperTypes);
        this.valueTypes = wrapperTypes.found;
    }
    visitNamespaceAfter(context) {
        for (let request of this.requestTypes){
            request.accept(context.clone({
                type: request
            }), this);
        }
    }
    visitNamespace(context) {
        const ns = context.namespace;
        this.write(`syntax = "proto3";

package ${ns.name};\n\n`);
        const options = context.config.options;
        if (options && Object.keys(options).length > 0) {
            Object.keys(options).forEach((name)=>{
                this.write(`option ${name} = "${options[name]}";\n`);
            });
            this.write(`\n`);
        }
        const visitor = new ImportVisitor(this.writer);
        ns.accept(context, visitor);
    }
    visitInterface(context) {
        if (!shouldIncludeHandler(context)) {
            return;
        }
        const visitor = new RoleVisitor(this.writer, this.requestTypes, this.exposedTypes);
        context.interface.accept(context, visitor);
    }
    visitTypeBefore(context) {
        const { type  } = context;
        if (!this.exposedTypes.has(type.name)) {
            return;
        }
        this.write(formatComment("// ", type.description));
        this.write(`message ${type.name} {\n`);
    }
    visitTypeField(context) {
        const { type , field  } = context;
        if (!this.exposedTypes.has(type.name)) {
            return;
        }
        const fieldnumAnnotation = field.annotation("n");
        if (!fieldnumAnnotation) {
            throw new Error(`${type.name}.${field.name} requires a @n`);
        }
        const fieldnum = fieldnumAnnotation.convert();
        this.write(formatComment("  // ", field.description));
        this.write(`  ${typeSignature(field.type)} ${snakeCase(field.name)} = ${fieldnum.value};\n`);
    }
    visitTypeAfter(context) {
        const { type  } = context;
        if (!this.exposedTypes.has(type.name)) {
            return;
        }
        this.write(`}\n\n`);
    }
    visitEnum(context) {
        const e = context.enum;
        if (!this.exposedTypes.has(e.name)) {
            return;
        }
        this.write(formatComment("// ", e.description));
        this.write(`enum ${pascalCase(e.name)} {\n`);
        e.values.forEach((ev)=>{
            this.write(formatComment("  // ", ev.description));
            this.write(`  ${snakeCase(ev.name).toUpperCase()} = ${ev.index};\n`);
        });
        this.write(`}\n\n`);
        if (!this.valueTypes.has(e.name)) {
            return;
        }
        this.write(`message ${pascalCase(e.name)}Value {\n`);
        this.write(`  ${pascalCase(e.name)} value = 1;\n`);
        this.write(`}\n\n`);
    }
    visitUnion(context) {
        const u = context.union;
        if (!this.exposedTypes.has(u.name)) {
            return;
        }
        this.write(formatComment("// ", u.description));
        this.write(`message ${pascalCase(u.name)} {\n`);
        this.write(`  oneof value {\n`);
        let i = 0;
        for (let t of u.types){
            const n = t;
            i++;
            this.write(`    ${typeSignature(t)} ${snakeCase(n.name)}_value = ${i};\n`);
        }
        this.write(`  }\n`);
        this.write(`}\n\n`);
    }
}
class RoleVisitor extends BaseVisitor {
    requestTypes = new Array();
    exposedTypes = new Set();
    constructor(writer, requestTypes, exposedTypes){
        super(writer);
        this.requestTypes = requestTypes;
        this.exposedTypes = exposedTypes;
    }
    visitInterfaceBefore(context) {
        if (!shouldIncludeHandler(context)) {
            return;
        }
        const { interface: iface  } = context;
        this.write(formatComment("// ", iface.description));
        this.write(`service ${iface.name} {\n`);
    }
    visitOperationBefore(context) {
        if (!shouldIncludeHandler(context)) {
            return;
        }
        const { interface: iface , operation  } = context;
        this.write(formatComment("  // ", operation.description));
        this.write(`  rpc ${pascalCase(operation.name)}(`);
        if (operation.parameters.length == 0) {
            this.write(`google.protobuf.Empty`);
        } else if (operation.unary) {
            const param = operation.parameters[0];
            const pt = unwrapKinds(param.type, Kind.Alias);
            switch(pt.kind){
                case Kind.Primitive:
                    const p = pt;
                    this.write(primitiveMessageType(p.name));
                    break;
                case Kind.Enum:
                    const e = pt;
                    this.write(`${e.name}Value`);
                    break;
                default:
                    this.write(`${typeSignature(pt)}`);
                    break;
            }
        } else {
            const argsType = convertOperationToType(context.getType.bind(context), iface, operation);
            this.requestTypes.push(argsType);
            this.exposedTypes.add(argsType.name);
            this.write(`${argsType.name}`);
        }
        this.write(`) returns (`);
        const ot = unwrapKinds(operation.type, Kind.Alias);
        switch(ot.kind){
            case Kind.Void:
                this.write(`google.protobuf.Empty`);
                break;
            case Kind.Primitive:
                const p1 = ot;
                this.write(primitiveMessageType(p1.name));
                break;
            case Kind.Enum:
                const e1 = ot;
                this.write(`${e1.name}Value`);
                break;
            default:
                this.write(`${typeSignature(ot)}`);
                break;
        }
        this.write(`) {};\n`);
    }
    visitOperationAfter(context) {
        if (!shouldIncludeHandler(context)) {
            return;
        }
    }
    visitInterfaceAfter(context) {
        if (!shouldIncludeHandler(context)) {
            return;
        }
        this.write(`}\n\n`);
    }
}
const scalarTypeMap = new Map([
    [
        "i8",
        "int32"
    ],
    [
        "i16",
        "int32"
    ],
    [
        "i32",
        "int32"
    ],
    [
        "i64",
        "int64"
    ],
    [
        "u8",
        "uint32"
    ],
    [
        "u16",
        "uint32"
    ],
    [
        "u32",
        "uint32"
    ],
    [
        "u64",
        "uint64"
    ],
    [
        "f32",
        "float"
    ],
    [
        "f64",
        "double"
    ],
    [
        "string",
        "string"
    ],
    [
        "bytes",
        "bytes"
    ],
    [
        "boolean",
        "bool"
    ],
    [
        "date",
        "google.protobuf.Timestamp"
    ],
    [
        "datetime",
        "google.protobuf.Timestamp"
    ],
    [
        "any",
        "google.protobuf.Any"
    ],
    [
        "value",
        "google.protobuf.Any"
    ]
]);
function typeSignature(type) {
    switch(type.kind){
        case Kind.Primitive:
            const p = type;
            return scalarTypeMap.get(p.name) || p.name;
        case Kind.Alias:
            const a = type;
            return typeSignature(a.type);
        case Kind.Type:
        case Kind.Enum:
        case Kind.Union:
            const named = type;
            return named.name;
        case Kind.List:
            return `repeated ${typeSignature(type.type)}`;
        case Kind.Map:
            const map = type;
            return `map<${typeSignature(map.keyType)}, ${typeSignature(map.valueType)}>`;
        case Kind.Optional:
            return `optional ${typeSignature(type.type)}`;
        case Kind.Stream:
            return `stream ${typeSignature(type.type)}`;
        default:
            throw new Error("unexpected kind: " + type.kind);
    }
}
class ImportVisitor extends BaseVisitor {
    hasObjects = false;
    found = new Set();
    addImport(name) {
        if (!this.found.has(name)) {
            this.found.add(name);
            this.write(`import "${name}";\n`);
        }
    }
    checkType(t) {
        switch(t.kind){
            case Kind.Void:
                this.addImport("google/protobuf/empty.proto");
                break;
            case Kind.Primitive:
                const p = t;
                switch(p.name){
                    case PrimitiveName.DateTime:
                        this.addImport("google/protobuf/timestamp.proto");
                        break;
                    case PrimitiveName.Any:
                        this.addImport("google/protobuf/any.proto");
                        break;
                }
                break;
        }
    }
    checkSingleType(t) {
        switch(t.kind){
            case Kind.Primitive:
                const p = t;
                switch(p.name){
                    case PrimitiveName.String:
                        this.addImport("google/protobuf/wrappers.proto");
                        break;
                }
                break;
        }
    }
    visitOperation(context) {
        if (!shouldIncludeHandler(context)) {
            return;
        }
        const { operation  } = context;
        if (operation.isUnary()) {
            this.checkSingleType(operation.parameters[0]);
        }
        this.checkType(operation.type);
        this.checkSingleType(operation.type);
    }
    visitParameter(context) {
        if (!shouldIncludeHandler(context)) {
            return;
        }
        const { parameter  } = context;
        this.checkType(parameter.type);
    }
    visitType(context) {
        const { type  } = context;
        this.checkType(type);
    }
    visitTypeField(context) {
        const { field  } = context;
        this.checkType(field.type);
    }
    visitNamespaceAfter(context) {
        if (this.found.size > 0) {
            this.write(`\n`);
        }
    }
}
function primitiveMessageType(name) {
    switch(name){
        case PrimitiveName.String:
            return `google.protobuf.StringValue`;
        case PrimitiveName.I64:
            return `google.protobuf.Int64Value`;
        case PrimitiveName.I32:
        case PrimitiveName.I16:
        case PrimitiveName.I8:
            return `google.protobuf.Int32Value`;
        case PrimitiveName.U64:
            return `google.protobuf.UInt64Value`;
        case PrimitiveName.U32:
        case PrimitiveName.U16:
        case PrimitiveName.U8:
            return `google.protobuf.UInt32Value`;
        case PrimitiveName.F64:
            return `google.protobuf.DoubleValue`;
        case PrimitiveName.F32:
            return `google.protobuf.FloatValue`;
        case PrimitiveName.Bool:
            return `google.protobuf.BoolValue`;
        case PrimitiveName.Bytes:
            return `google.protobuf.BytesValue`;
        case PrimitiveName.Any:
            return `google.protobuf.Any`;
    }
    return "unknown";
}
class WrapperTypesVisitor extends BaseVisitor {
    found = new Set();
    visitOperation(context) {
        if (!isService(context)) {
            return;
        }
        const { operation  } = context;
        if (operation.unary) {
            const p = operation.parameters[0];
            if (p.type.kind == Kind.Enum) {
                this.found.add(p.type.name);
            }
        }
        if (operation.type.kind == Kind.Enum) {
            this.found.add(operation.type.name);
        }
    }
}
class GRPCVisitor1 extends ProtoVisitor {
}
const mod6 = {
    default: ProtoVisitor,
    ProtoVisitor,
    WrapperTypesVisitor,
    GRPCVisitor: GRPCVisitor1
};
const translations2 = new Map([
    [
        "ID",
        "str"
    ],
    [
        "string",
        "str"
    ],
    [
        "i64",
        "int"
    ],
    [
        "i32",
        "int"
    ],
    [
        "i16",
        "int"
    ],
    [
        "i8",
        "int"
    ],
    [
        "u64",
        "int"
    ],
    [
        "u32",
        "int"
    ],
    [
        "u16",
        "int"
    ],
    [
        "u8",
        "int"
    ],
    [
        "f64",
        "float"
    ],
    [
        "f32",
        "float"
    ]
]);
function mapVals1(vd, sep, joinOn) {
    return vd.map((vd)=>`${vd.name}${sep} ${expandType2(vd.type, true)};`).join(joinOn);
}
function defValue1(fieldDef) {
    fieldDef.name;
    const type = fieldDef.type;
    if (fieldDef.default) {
        let returnVal = fieldDef.default.getValue();
        if (fieldDef.type.kind == Kind.Primitive) {
            returnVal = fieldDef.type.name == PrimitiveName.String ? strQuote1(returnVal) : returnVal;
        }
        return returnVal;
    }
    switch(type.kind){
        case Kind.Optional:
            return "None";
        case Kind.List:
            return "[]";
        case Kind.Map:
            return "{}";
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            switch(type.name){
                case "ID":
                case "string":
                    return `''`;
                case "bool":
                    return "false";
                case "i8":
                case "u8":
                case "i16":
                case "u16":
                case "i32":
                case "u32":
                case "i64":
                case "u64":
                    return "int(0)";
                case "f32":
                case "f64":
                    return "float(0)";
                case "bytes":
                    return "bytes(0)";
                default:
                    return `${capitalize(type.name)}()`;
            }
    }
    return `???${expandType2(type, false)}???`;
}
function defaultValueForType1(type) {
    if (type.kind == Kind.Alias) {
        type = type.type;
    }
    switch(type.kind){
        case Kind.Optional:
            return "null";
        case Kind.List:
            return "new List()";
        case Kind.Map:
            return `new Map()`;
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            const name = type.name;
            switch(name){
                case "ID":
                case "string":
                    return `''`;
                case "bool":
                    return "false";
                case "i8":
                case "u8":
                case "i16":
                case "u16":
                case "i32":
                case "u32":
                case "i64":
                case "u64":
                case "f32":
                case "f64":
                    return "0";
                case "bytes":
                    return "new ArrayBuffer(0)";
                default:
                    return `new ${capitalize(name)}()`;
            }
    }
    return "???";
}
const strQuote1 = (s)=>{
    return `'${s}'`;
};
const expandType2 = (type, useOptional)=>{
    switch(type.kind){
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            const namedValue = type.name;
            translations2.get(namedValue);
            return namedValue;
        case Kind.Map:
            return `dict[${expandType2(type.keyType, true)},${expandType2(type.valueType, true)}]`;
        case Kind.List:
            return `list[${expandType2(type.type, true)}]`;
        case Kind.Optional:
            let expanded = expandType2(type.type, true);
            if (useOptional) {
                return `Optional[${expanded}]`;
            }
            return expanded;
        default:
            return "unknown";
    }
};
function opsAsFns1(ops) {
    return ops.map((op)=>{
        return `function ${op.name}(${mapArgs(op.parameters)}): ${expandType2(op.type, true)} {\n}`;
    }).join("\n");
}
function mapArgs(params) {
    return params.map((param)=>{
        return mapArg(param);
    }).join(", ");
}
function mapArg(param) {
    return `${snakeCase(param.name)}: ${expandType2(param.type, true)}`;
}
function isNode(o) {
    for (const field of o.fields){
        if (field.name.toLowerCase() == "id") {
            return true;
        }
    }
    return false;
}
function varAccessArg1(variable, params) {
    return params.map((param)=>{
        return `${variable}.${param.name}`;
    }).join(", ");
}
class ClassVisitor extends BaseVisitor {
    visitTypeBefore(context) {
        super.triggerTypeBefore(context);
        const t = context.type;
        this.write(`@deserialize
@serialize
@dataclass\n`);
        this.write(formatComment("# ", t.description));
        this.write(`class `);
        if (t.name.endsWith("Args")) {
            this.write(`_`);
        }
        this.write(`${t.name}:\n`);
    }
    visitTypeField(context) {
        const field = context.field;
        this.write(formatComment("\t# ", field.description));
        var defaultSuffix = "";
        var defaultValue = defValue1(field);
        switch(field.type.kind){
            case Kind.List:
                defaultSuffix = "_factory";
                defaultValue = "list";
                break;
            case Kind.Map:
                defaultSuffix = "_factory";
                defaultValue = "dict";
                break;
        }
        this.write(`\t${snakeCase(field.name)}: ${expandType2(field.type, true)} = field(default${defaultSuffix}=${defaultValue}, metadata={'serde_rename': '${field.name}'})\n`);
        super.triggerTypeField(context);
    }
    visitTypeAfter(context) {
        this.write(`\n\n`);
    }
}
class ArgsVisitor extends BaseVisitor {
    visitOperation(context) {
        const { interface: iface , operation  } = context;
        if (noCode(operation)) {
            return;
        }
        if (operation.parameters.length == 0 || operation.isUnary()) {
            return;
        }
        const argObject = convertOperationToType(context.getType.bind(context), iface, operation);
        const args = new ClassVisitor(this.writer);
        argObject.accept(context.clone({
            type: argObject
        }), args);
        super.triggerOperation(context);
    }
}
class HandlerVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { interface: iface  } = context;
        this.write(formatComment("# ", iface.description));
        this.write(`class ${iface.name}:\n`);
    }
    visitOperation(context) {
        const { operation  } = context;
        if (noCode(operation)) {
            return;
        }
        let opVal = "";
        this.write(formatComment("\t# ", operation.description));
        opVal += `\tasync def ${snakeCase(operation.name)}(`;
        if (operation.isUnary()) {
            opVal += expandType2(operation.unaryOp().type, true);
        } else {
            operation.parameters.map((param, i)=>{
                if (i > 0) {
                    opVal += `, `;
                }
                opVal += snakeCase(param.name) + ": ";
                opVal += expandType2(param.type, true);
            });
        }
        opVal += `) -> Awaitable`;
        if (!isVoid(operation.type)) {
            opVal += `[${expandType2(operation.type, true)}]`;
        }
        opVal += `:\n\t\tpass\n`;
        this.write(opVal);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class InterfaceVisitor2 extends BaseVisitor {
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { interface: iface  } = context;
        this.write(formatComment("# ", iface.description));
        this.write(`class ${iface.name}:\n`);
    }
    visitOperation(context) {
        const operation = context.operation;
        if (noCode(operation)) {
            return;
        }
        let opVal = "";
        this.write(formatComment("\t# ", operation.description));
        opVal += `\tasync def ${snakeCase(operation.name)}(self`;
        if (operation.parameters.length > 0) {
            opVal += `, `;
            if (operation.isUnary()) {
                opVal += mapArg(operation.unaryOp());
            } else {
                opVal += mapArgs(operation.parameters);
            }
        }
        opVal += `)`;
        if (!isVoid(operation.type)) {
            opVal += ` -> ${expandType2(operation.type, true)}`;
        }
        opVal += `:
\t\tpass\n\n`;
        this.write(opVal);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`\n\n`);
    }
}
class InterfacesVisitor2 extends BaseVisitor {
    visitNamespaceBefore(context) {
        this.write(`from typing import Optional, Awaitable, Type, TypeVar
from serde import serialize, deserialize
from dataclasses import dataclass, field\n\n\n`);
        const types = new TypesVisitor(this.writer);
        taccept(context, types);
    }
}
class TypesVisitor extends BaseVisitor {
    visitTypeBefore(context) {
        const clazz = new ClassVisitor(this.writer);
        context.type.accept(context, clazz);
    }
    visitInterfaceBefore(context) {
        if (isProvider(context)) {
            const iface = new InterfaceVisitor2(this.writer);
            context.interface.accept(context, iface);
        } else if (isHandler(context)) {
            const handler = new HandlerVisitor(this.writer);
            context.interface.accept(context, handler);
        }
    }
}
function taccept(context, visitor) {
    context = new Context(context.config, undefined, context);
    tsort(context);
    visitor.visitNamespaceBefore(context);
    const namespace = context.namespace;
    visitor.visitDirectivesBefore(context);
    for (const directive of Object.values(namespace.directives)){
        directive.accept(context.clone({
            directive: directive
        }), visitor);
    }
    visitor.visitDirectivesAfter(context);
    for (const t of Object.values(namespace.allTypes)){
        switch(t.kind){
            case Kind.Type:
                const td = t;
                if (!td.annotation("novisit")) {
                    td.accept(context.clone({
                        type: td
                    }), visitor);
                }
                break;
            case Kind.Union:
                const ud = t;
                ud.accept(context.clone({
                    union: ud
                }), visitor);
                break;
            case Kind.Alias:
                const ad = t;
                ad.accept(context.clone({
                    alias: ad
                }), visitor);
                break;
            case Kind.Enum:
                const ed = t;
                if (!ed.annotation("novisit")) {
                    ed.accept(context.clone({
                        enumDef: ed
                    }), visitor);
                }
                break;
        }
    }
    visitor.visitAllOperationsBefore(context);
    visitor.visitInterfacesBefore(context);
    for (const iface of Object.values(namespace.interfaces)){
        iface.accept(context.clone({
            interface: iface
        }), visitor);
    }
    visitor.visitInterfacesAfter(context);
    visitor.visitAllOperationsAfter(context);
    visitor.visitNamespaceAfter(context);
}
function tsort(context) {
    const deps = {};
    for (const iface of Object.values(context.namespace.interfaces)){
        var d = deps[iface.name];
        if (!d) {
            d = [];
            deps[iface.name] = d;
        }
        iface.operations.map((oper)=>{
            oper.parameters.map((param)=>{
                visitNamed(param.type, (name)=>{
                    if (d.indexOf(name) == -1) {
                        d.push(name);
                    }
                });
            });
            visitNamed(oper.type, (name)=>{
                if (d.indexOf(name) == -1) {
                    d.push(name);
                }
            });
        });
    }
    for (const [name, t] of Object.entries(context.namespace.allTypes)){
        var d = deps[name];
        if (!d) {
            d = [];
            deps[name] = d;
        }
        switch(t.kind){
            case Kind.Type:
                const ty = t;
                ty.fields.map((f)=>{
                    visitNamed(f.type, (name)=>{
                        if (d.indexOf(name) == -1) {
                            d.push(name);
                        }
                    });
                });
                break;
            case Kind.Union:
                const un = t;
                un.types.map((ty)=>{
                    visitNamed(ty, (name)=>{
                        if (d.indexOf(name) == -1) {
                            d.push(name);
                        }
                    });
                });
                break;
            case Kind.Alias:
                const a = t;
                visitNamed(a.type, (name)=>{
                    if (d.indexOf(name) == -1) {
                        d.push(name);
                    }
                });
                break;
        }
    }
    const edges = createEdges(deps);
    class Node {
        id;
        afters;
        constructor(id){
            this.id = id;
            this.afters = [];
        }
    }
    const nodes = {};
    const sorted = [];
    const visited = {};
    edges.forEach((v)=>{
        let from = v[0], to = v[1];
        if (!nodes[from]) nodes[from] = new Node(from);
        if (!nodes[to]) nodes[to] = new Node(to);
        nodes[from].afters.push(to);
    });
    const ancestors = [];
    Object.keys(nodes).forEach(function visit(idstr) {
        let node = nodes[idstr], id = node.id;
        if (visited[idstr]) return;
        ancestors.push(id);
        visited[idstr] = true;
        node.afters.forEach(function(afterID) {
            if (ancestors.indexOf(afterID) < 0) visit(afterID.toString());
        });
        sorted.unshift(id);
    });
    const ordered = new Map();
    sorted.forEach((n)=>{
        const t = context.namespace.allTypes[n];
        if (t) {
            ordered.set(n, t);
        }
    });
    for (const [k, v] of Object.entries(ordered)){
        delete context.namespace.allTypes[k];
        context.namespace.allTypes[k] = v;
    }
}
const createEdges = (deps)=>{
    let result = [];
    Object.keys(deps).forEach((key)=>{
        deps[key].forEach((n)=>{
            result.push([
                n,
                key
            ]);
        });
    });
    return result;
};
class ProviderVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        const { interface: iface  } = context;
        this.write(`class ${iface.name}Impl(${iface.name}):
\tdef __init__(self, invoker: Invoker):
\t\tself.invoker = invoker\n\n`);
    }
    visitOperation(context) {
        const { interface: iface  } = context;
        this.write(`\n`);
        const operation = context.operation;
        this.write(formatComment("\t# ", operation.description));
        this.write(`\tasync def ${snakeCase(operation.name)}(self`);
        operation.parameters.map((param, index)=>{
            this.write(`, ${snakeCase(param.name)}: ${expandType2(param.type, true)}`);
        });
        this.write(`)`);
        const retVoid = isVoid(operation.type);
        if (!retVoid) {
            this.write(` -> ${expandType2(operation.type, true)}`);
        }
        this.write(`:\n`);
        const retStr = retVoid ? "" : "return ";
        const withRet = retVoid ? "" : "_with_return";
        const nsop = `'${context.namespace.name + "." + iface.name}', '${operation.name}'`;
        if (operation.parameters.length == 0) {
            this.write(`\t\t${retStr}await self.invoker.invoke${withRet}('${context.namespace.name + "." + iface.name}', '${operation.name}', None`);
        } else if (operation.isUnary()) {
            this.write(`\t\t${retStr}await self.invoker.invoke${withRet}(${nsop}, ${operation.unaryOp().name}`);
        } else {
            this.write(`\t\tinput_args = _${capitalize(iface.name)}${capitalize(operation.name)}Args(`);
            operation.parameters.map((param, i)=>{
                if (i > 0) {
                    this.write(`, `);
                }
                const paramName = param.name;
                this.write(`\t\t\t${snakeCase(paramName)}`);
            });
            this.write(`\t\t)\n`);
            this.write(`\t\t${retStr}await self.invoker.invoke${withRet}(${nsop}, input_args`);
        }
        if (!retVoid) {
            this.write(`, ${expandType2(operation.type, true)}`);
        }
        this.write(`)\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        if (!isProvider(context)) {
            super.triggerInterfaceAfter(context);
            return;
        }
        const { interface: iface  } = context;
        this.write(`\n\n`);
        this.write(`${camelCase(iface.name)} = ${iface.name}Impl(invoker)\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class ScaffoldVisitor2 extends BaseVisitor {
    visitNamespaceBefore(context) {
        this.write(`#!/usr/bin/env python3\n`);
        const adapter = new AdapterTypesVisitor(this.writer);
        context.namespace.accept(context, adapter);
        const types = new TypesVisitor1(this.writer);
        context.namespace.accept(context, types);
        this.write(`\n`);
    }
    visitNamespaceAfter(context) {
        const main = new MainVisitor2(this.writer);
        context.namespace.accept(context, main);
        this.write(`\n\nif __name__ == "__main__":
\tmain()
\n`);
    }
    visitInterfaceBefore(context) {
        if (!isHandler(context)) {
            return;
        }
        const impl = new ImplVisitor(this.writer);
        context.interface.accept(context, impl);
    }
}
class MainVisitor2 extends BaseVisitor {
    visitNamespaceBefore(context) {
        this.write(`def main():\n`);
    }
    visitInterfaceBefore(context) {
        if (!isHandler(context)) {
            return;
        }
        super.triggerInterfaceBefore(context);
        const name = context.interface.name;
        this.write(`\tregister_${snakeCase(name)}(${name}Impl())\n`);
    }
    visitNamespaceAfter(context) {
        this.write(`\n\tstart()\n`);
    }
}
class ImplVisitor extends BaseVisitor {
    stateful;
    constructor(writer, stateful = false){
        super(writer);
        this.stateful = stateful;
    }
    visitInterfaceBefore(context) {
        if (!isHandler(context)) {
            return;
        }
        super.triggerInterfaceBefore(context);
        const name = context.interface.name;
        this.write(`class ${name}Impl(${name}):\n`);
    }
    visitOperation(context) {
        this.write(`\n`);
        const { interface: iface , operation  } = context;
        if (noCode(operation)) {
            return;
        }
        let opVal = "";
        opVal += `\tasync def ${snakeCase(operation.name)}(self`;
        if (this.stateful) {
            opVal += ", ctx: Context";
        }
        if (operation.parameters.length > 0) {
            opVal += ", ";
        }
        if (operation.isUnary()) {
            opVal += mapArg(operation.unaryOp());
        } else {
            opVal += mapArgs(operation.parameters);
        }
        opVal += `)`;
        if (!isVoid(operation.type)) {
            opVal += ` -> ${expandType2(operation.type, true)}`;
        }
        opVal += `:\n`;
        this.write(opVal);
        if (!isVoid(operation.type)) {
            const dv = defaultValueForType1(operation.type);
            this.write(`\t\treturn ${dv};`);
        } else {
            this.write(`\t\treturn\n`);
        }
        this.write(`\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`\n\n`);
    }
}
class AdapterTypesVisitor extends BaseVisitor {
    visitNamespaceBefore(content) {
        this.write(`from adapter import start`);
    }
    visitInterface(context) {
        const { interface: iface  } = context;
        if (isHandler(context)) {
            this.write(`, register_${snakeCase(iface.name)}`);
        }
        if (isProvider(context)) {
            this.write(`, ${snakeCase(iface.name)}`);
        }
    }
    visitNamespaceAfter(content) {
        this.write(`\n`);
    }
}
class TypesVisitor1 extends BaseVisitor {
    hasObjects = false;
    found = new Set();
    visitNamespaceBefore(context) {}
    addImport(name) {
        if (!this.found.has(name)) {
            this.found.add(name);
            if (!this.hasObjects) {
                this.write(`from interfaces import `);
                this.hasObjects = true;
            } else {
                this.write(`, `);
            }
            this.write(name);
        }
    }
    addType(t) {
        if (t.kind == Kind.Alias) {
            t = t.type;
        }
        switch(t.kind){
            case Kind.Type:
                const v = t;
                this.addImport(v.name);
                break;
            case Kind.Optional:
                const o = t;
                this.addType(o.type);
                break;
            case Kind.List:
                const l = t;
                this.addType(l.type);
                break;
            case Kind.Map:
                const m = t;
                this.addType(m.keyType);
                this.addType(m.valueType);
        }
    }
    visitInterface(context) {
        const { interface: iface  } = context;
        if (isHandler(context)) {
            this.addImport(iface.name);
        }
    }
    visitOperation(context) {
        const operation = context.operation;
        this.addType(operation.type);
    }
    visitParameter(context) {
        const parameter = context.parameter;
        this.addType(parameter.type);
    }
    visitNamespaceAfter(context) {
        if (this.hasObjects) {
            this.write(`\n\n`);
        }
    }
}
class WrapperVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { interface: iface  } = context;
        this.write(`def register_${snakeCase(iface.name)}(h: ${iface.name}):\n`);
    }
    visitOperation(context) {
        const { interface: iface  } = context;
        const operation = context.operation;
        if (noCode(operation)) {
            return;
        }
        this.write(`\tif not h.${snakeCase(operation.name)} is None:\n`);
        this.write(`\t\tasync def handler(input: bytes) -> bytes:\n`);
        const resultStr = isVoid(operation.type) ? "" : "result = ";
        if (operation.parameters.length == 0) {
            this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}()\n`);
        } else if (operation.isUnary()) {
            const unaryType = expandType2(operation.unaryOp().type, true);
            this.write(`\t\t\tpayload: ${unaryType} = handlers.codec.decode(input, ${unaryType})\n`);
            this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}(payload)\n`);
        } else {
            const argsClass = `_${capitalize(iface.name)}${capitalize(operation.name)}Args`;
            this.write(`\t\t\tinput_args: ${argsClass} = handlers.codec.decode(input, ${argsClass})\n`);
            this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}(`);
            operation.parameters.map((param, i)=>{
                const paramName = snakeCase(param.name);
                if (i > 0) {
                    this.write(`, `);
                }
                this.write(`input_args.${paramName}`);
            });
            this.write(`)\n`);
        }
        if (!isVoid(operation.type)) {
            this.write(`\t\t\treturn handlers.codec.encode(result)\n`);
        } else {
            this.write(`\t\t\treturn bytes(0)\n`);
        }
        this.write(`\t\thandlers.register_handler('${context.namespace.name}.${iface.name}', '${operation.name}', handler)\n\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class WrapperStatefulVisitor extends BaseVisitor {
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { namespace: ns , interface: iface  } = context;
        const fullns = ns.name + "." + iface.name;
        this.write(`def register_${snakeCase(iface.name)}(h: ${iface.name}):
\thandlers.register_stateful_handler(
\t\t'${fullns}', 'deactivate',
\t\tstate_manager.deactivate_handler('${fullns}', h))\n\n`);
    }
    visitOperation(context) {
        const { namespace: ns , interface: iface  } = context;
        const fullns = ns.name + "." + iface.name;
        const operation = context.operation;
        if (noCode(operation)) {
            return;
        }
        this.write(`\tif not h.${snakeCase(operation.name)} is None:\n`);
        this.write(`\t\tasync def handler(id: str, input: bytes) -> bytes:\n`);
        this.write(`\t\t\tsctx = await state_manager.to_context("${fullns}", id, h)\n`);
        const resultStr = isVoid(operation.type) ? "" : "result = ";
        if (operation.parameters.length == 0) {
            this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}(sctx)\n`);
        } else if (operation.isUnary()) {
            const unaryType = expandType2(operation.unaryOp().type, true);
            this.write(`\t\t\tpayload: ${unaryType} = handlers.codec.decode(input, ${unaryType})\n`);
            this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}(sctx, payload)\n`);
        } else {
            const argsClass = `_${capitalize(iface.name)}${capitalize(operation.name)}Args`;
            this.write(`\t\t\tinput_args: ${argsClass} = handlers.codec.decode(input, ${argsClass})\n`);
            this.write(`\t\t\t${resultStr}await h.${snakeCase(operation.name)}(sctx`);
            operation.parameters.map((param, i)=>{
                const paramName = snakeCase(param.name);
                this.write(`, `);
                this.write(`input_args.${paramName}`);
            });
            this.write(`)\n`);
        }
        if (!isVoid(operation.type)) {
            this.write(`\t\t\tresponse = sctx.response(result)\n`);
            this.write(`\t\t\treturn handlers.codec.encode(response)\n`);
        } else {
            this.write(`\t\t\tresponse = sctx.response(None)\n`);
            this.write(`\t\t\treturn handlers.codec.encode(response)\n`);
        }
        this.write(`\t\thandlers.register_stateful_handler('${context.namespace.name}.${iface.name}', '${operation.name}', handler)\n\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
const mod7 = {
    default: InterfacesVisitor2,
    ArgsVisitor,
    ClassVisitor,
    mapVals: mapVals1,
    defValue: defValue1,
    defaultValueForType: defaultValueForType1,
    strQuote: strQuote1,
    expandType: expandType2,
    opsAsFns: opsAsFns1,
    mapArgs,
    mapArg,
    isNode,
    varAccessArg: varAccessArg1,
    translations: translations2,
    HandlerVisitor,
    InterfaceVisitor: InterfaceVisitor2,
    InterfacesVisitor: InterfacesVisitor2,
    ProviderVisitor,
    ScaffoldVisitor: ScaffoldVisitor2,
    WrapperVisitor,
    WrapperStatefulVisitor
};
class SourceGenerator extends AbstractVisitor1 {
    root;
    context;
    source = "";
    constructor(root, context){
        super();
        this.root = root;
        this.context = context;
    }
    append(source) {
        this.source += source;
    }
    getSource() {
        return this.source;
    }
    toString() {
        this.root.accept(this.context, this);
        return this.getSource();
    }
}
class ContextWriter extends BaseVisitor {
    source = "";
    constructor(writer){
        super(writer);
    }
    append(source) {
        this.source += source;
    }
    visitContextAfter(context) {
        this.write(this.source);
    }
}
function rustDoc(doc) {
    return doc ? `/// ${doc}` : "";
}
function trimLines(lines) {
    const finalLines = [];
    for (const line of lines){
        const trimmed = line.trim();
        if (trimmed.length > 0) finalLines.push(trimmed);
    }
    return finalLines.join("\n");
}
function rustify(name) {
    const base = snakeCase(name);
    return isReservedWord(base) ? `r#${base}` : base;
}
function rustifyCaps(name) {
    const base = pascalCase(name);
    if (isReservedWord(base)) {
        throw new Error(`Can not use ${base} as a Rust name or identifier`);
    }
    return base;
}
function apexToRustType(typ, config, asRef = false, lifetime = "") {
    const ref = asRef ? `&${lifetime} ` : "";
    switch(typ.kind){
        case Kind.List:
            {
                const t = typ;
                const itemType = apexToRustType(t.type, config);
                return asRef ? `${ref}[${itemType}]` : `Vec<${itemType}>`;
            }
        case Kind.Map:
            {
                const t1 = typ;
                const keyType = apexToRustType(t1.keyType, config);
                const valueType = apexToRustType(t1.valueType, config);
                return `${ref}std::collections::HashMap<${keyType},${valueType}>`;
            }
        case Kind.Optional:
            {
                const t2 = typ;
                const innerType = apexToRustType(t2.type, config);
                return `${ref}Option<${innerType}>`;
            }
        case Kind.Stream:
            {
                const t3 = typ;
                const outputType = apexToRustType(t3.type, config);
                return asRef ? `${ref}dyn Stream<Item=${outputType}>` : `Box<dyn Stream<Item=${outputType}>>`;
            }
        case Kind.Union:
        case Kind.Enum:
        case Kind.Alias:
        case Kind.Type:
            {
                return `${ref}${rustifyCaps(typ.name)}`;
            }
        case Kind.Void:
            {
                return "()";
            }
        case Kind.Primitive:
            {
                const t4 = typ;
                return primitiveToRust(t4, config, asRef, lifetime);
            }
        default:
            {
                throw new Error(`Unhandled type conversion for type: ${typ.kind}`);
            }
    }
}
function primitiveToRust(t, config, asRef = false, lifetime = "") {
    const ref = asRef ? `&${lifetime} ` : "";
    switch(t.name){
        case PrimitiveName.Bool:
            return `${ref}bool`;
        case PrimitiveName.Bytes:
            {
                const typ = config.bytes ? config.bytes : "Vec<u8>";
                return `${ref}${typ}`;
            }
        case PrimitiveName.DateTime:
            {
                const typ1 = config.datetime ? config.datetime : "time::OffsetDateTime";
                return `${ref}${typ1}`;
            }
        case PrimitiveName.F32:
            return `${ref}f32`;
        case PrimitiveName.F64:
            return `${ref}f64`;
        case PrimitiveName.U64:
            return `${ref}u64`;
        case PrimitiveName.U32:
            return `${ref}u32`;
        case PrimitiveName.U16:
            return `${ref}u16`;
        case PrimitiveName.U8:
            return `${ref}u8`;
        case PrimitiveName.I64:
            return `${ref}i64`;
        case PrimitiveName.I32:
            return `${ref}i32`;
        case PrimitiveName.I16:
            return `${ref}i16`;
        case PrimitiveName.I8:
            return `${ref}i8`;
        case PrimitiveName.String:
            return asRef ? `${ref}str` : "String";
        case PrimitiveName.Any:
            {
                const typ2 = config.anyType ? config.anyType.toString() : "serde_value::Value";
                return `${ref}${typ2}`;
            }
        default:
            throw new Error(`Unhandled primitive type conversion for type: ${t.name}`);
    }
}
function defaultValue(type, config) {
    switch(type.kind){
        case Kind.Optional:
            return "None";
        case Kind.List:
            return "Vec::new()";
        case Kind.Map:
            return "std::collections::HashMap::new()";
        case Kind.Primitive:
            return defaultValueForPrimitive(type, config);
        case Kind.Union:
        case Kind.Enum:
        case Kind.Alias:
        case Kind.Type:
            return `${rustifyCaps(type.name)}::default()`;
    }
    throw new Error(`Can not generate default value code for type ${type.kind}`);
}
function defaultValueForPrimitive(type, config) {
    if (type.kind !== Kind.Primitive) throw new Error(`Can not expand non-primitive type ${type.kind}`);
    const t = type;
    switch(t.name){
        case PrimitiveName.Any:
            return config.anyType ? `${config.anyType.toString()}::default()` : "serde_value::Value::Null";
        case PrimitiveName.F32:
        case PrimitiveName.F64:
        case PrimitiveName.U64:
        case PrimitiveName.U32:
        case PrimitiveName.U16:
        case PrimitiveName.U8:
        case PrimitiveName.I64:
        case PrimitiveName.I32:
        case PrimitiveName.I16:
        case PrimitiveName.I8:
            return "0";
        case PrimitiveName.String:
            return "String::new()";
        case PrimitiveName.Bool:
            return "false";
        case PrimitiveName.Bytes:
            return "Vec::new()";
        case PrimitiveName.DateTime:
            return "time::OffsetDateTime::default()";
        case PrimitiveName.Value:
            config.anyType ? `${config.anyType.toString()}::default()` : "serde_value::Value::Null";
        default:
            throw new Error(`Unhandled primitive type ${t.name}`);
    }
}
const mod8 = {
    apexToRustType: apexToRustType,
    defaultValue: defaultValue,
    defaultValueForPrimitive: defaultValueForPrimitive
};
function deriveDirective(name, config) {
    const derive = [];
    if (config.derive) {
        if (config.derive._all) {
            derive.push(...config.derive._all);
        }
        if (config.derive[name]) {
            derive.push(...config.derive[name]);
        }
    }
    if (useSerde(config)) {
        derive.push("serde::Serialize", "serde::Deserialize");
    }
    return `#[derive(${derive.join(",")})]`;
}
function customAttributes(name, config) {
    const attributes = [];
    if (config.attributes) {
        if (config.attributes._all) {
            if (Array.isArray(config.attributes._except) && !config.attributes._except.some((n)=>n == name)) attributes.push(...config.attributes._all);
        }
        if (config.attributes[name]) {
            attributes.push(...config.attributes[name]);
        }
    }
    return attributes.join("\n");
}
function isNewType(name, config) {
    if (config.newtype) {
        if (config.newtype[name] !== undefined) {
            return !!config.newtype[name];
        }
        return !!config.newtype._all;
    }
    return false;
}
function useSerde(config) {
    return !!config.serde;
}
function visibility(item, config) {
    if (config.visibility) {
        if (config.visibility[item]) return _visibility(config.visibility[item]);
        return _visibility(config.visibility._all);
    }
    return _visibility("");
}
function _visibility(config) {
    if (config.startsWith("pub")) {
        return "pub";
    } else if (config.startsWith("crate")) {
        return "pub(crate)";
    } else {
        return "";
    }
}
function isReservedWord(name) {
    return reservedWords.includes(name);
}
const mod9 = {
    types: mod8,
    rustDoc: rustDoc,
    trimLines: trimLines,
    rustify: rustify,
    rustifyCaps: rustifyCaps,
    deriveDirective: deriveDirective,
    customAttributes: customAttributes,
    isNewType: isNewType,
    useSerde: useSerde,
    visibility: visibility,
    isReservedWord: isReservedWord
};
const reservedWords = [
    "as",
    "break",
    "const",
    "continue",
    "crate",
    "else",
    "enum",
    "extern",
    "false",
    "fn",
    "for",
    "if",
    "impl",
    "in",
    "let",
    "loop",
    "match",
    "mod",
    "move",
    "mut",
    "pub",
    "ref",
    "return",
    "self",
    "Self",
    "static",
    "struct",
    "super",
    "trait",
    "true",
    "type",
    "unsafe",
    "use",
    "where",
    "while",
    "async",
    "await",
    "dyn",
    "abstract",
    "become",
    "box",
    "do",
    "final",
    "macro",
    "override",
    "priv",
    "typeof",
    "unsized",
    "virtual",
    "yield",
    "try"
];
class StructVisitor1 extends SourceGenerator {
    config;
    visibility;
    constructor(type, context){
        super(type, context);
        this.config = context.config;
        this.visibility = visibility(this.root.name, this.config);
    }
    getSource() {
        let prefix = trimLines([
            rustDoc(this.root.description),
            deriveDirective(this.root.name, this.config),
            customAttributes(this.root.name, this.config)
        ]);
        return `
    ${prefix}
    ${this.visibility} struct ${rustifyCaps(this.root.name)}{
      ${this.source}
    }`;
    }
    visitTypeField(context) {
        const { field  } = context;
        let isRecursive = isRecursiveType(field.type);
        let isHeapAllocated = field.type.kind === Kind.Map || field.type.kind === Kind.List;
        let baseType = mod8.apexToRustType(field.type, context.config);
        let typeString = isRecursive && !isHeapAllocated ? `Box<${baseType}>` : baseType;
        let serdeAnnotation = "";
        if (useSerde(context.config)) {
            let date_with = "";
            if (isPrimitive(field.type) && field.type.name === "datetime" && !this.config.datetime) {
                date_with = ',with = "time::serde::rfc3339"';
            }
            serdeAnnotation = `#[serde(rename = "${field.name}"${date_with})]`;
        }
        visibility(this.root.name, this.config);
        this.append(`${trimLines([
            rustDoc(field.description),
            serdeAnnotation
        ])}
      ${this.visibility} ${rustify(field.name)}: ${typeString},
      `.trim());
    }
}
class InterfaceVisitor3 extends SourceGenerator {
    config;
    visibility;
    constructor(iface, context){
        super(iface, context);
        this.config = context.config;
        this.visibility = visibility(this.root.name, this.config);
    }
    getSource() {
        let prefix = trimLines([
            rustDoc(this.root.description),
            customAttributes(this.root.name, this.config)
        ]);
        return `${prefix}
    ${this.visibility} trait ${rustifyCaps(this.root.name)} {${this.source}}\n`;
    }
    visitOperation(context) {
        this.append(genOperation(context.operation, this.visibility, this.config));
    }
}
function genOperation(op, vis, config) {
    const typeString = apexToRustType(op.type, config);
    let args = op.parameters.map((arg)=>{
        return `${rustify(arg.name)}: ${apexToRustType(arg.type, config)}`;
    }).join(",");
    return `${trimLines([
        rustDoc(op.description)
    ])}
    fn ${rustify(op.name)}(${args}) -> ${typeString};
    `;
}
class EnumVisitor3 extends SourceGenerator {
    hasDisplayValues = false;
    hasIndices = false;
    config;
    visibility;
    constructor(e, context){
        super(e, context);
        this.config = context.config;
        this.visibility = visibility(this.root.name, this.config);
    }
    getSource() {
        const optionalDisplayImpl = this.hasDisplayValues ? displayImpl(this.root) : "";
        const optionalIndexConversion = this.hasIndices ? fromIndexImpl(this.root) : "";
        const optionalIntoIndexConversion = this.hasIndices ? intoIndexImpl(this.root) : "";
        let prefix = trimLines([
            rustDoc(this.root.description),
            deriveDirective(this.root.name, this.config),
            customAttributes(this.root.name, this.config)
        ]);
        return `
    ${prefix}
    ${this.visibility} enum ${rustifyCaps(this.root.name)}{
      ${this.source}
    }
    ${trimLines([
            optionalDisplayImpl,
            optionalIndexConversion,
            optionalIntoIndexConversion
        ])}

    `;
    }
    visitEnumValue(context) {
        const { enumValue  } = context;
        this.hasDisplayValues ||= enumValue.display !== undefined;
        this.hasIndices ||= enumValue.index !== undefined;
        this.append(`
      ${trimLines([
            rustDoc(enumValue.description)
        ])}
      ${rustifyCaps(enumValue.name)},`.trim());
    }
}
function displayImpl(node) {
    let values = node.values.map((v)=>`Self::${rustifyCaps(v.name)} => ${v.display ? `"${v.display}"` : 'unimplemented!("No display value provided in schema")'}`).join(",");
    return `
  impl std::fmt::Display for ${rustifyCaps(node.name)} {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
      write!(f, "{}", match self {
        ${values}
      })
    }
  }
  `;
}
function fromIndexImpl(node) {
    let type = "u32";
    node.annotation("index_type", (annotation)=>{
        type = annotation.convert().type;
    });
    let patterns = node.values.filter((v)=>v.index !== undefined).map((v)=>`${v.index} => Ok(Self::${rustifyCaps(v.name)})`).join(",");
    return `
  impl std::convert::TryFrom<${type}> for ${rustifyCaps(node.name)} {
    type Error = String;
    fn try_from(index: ${type}) -> Result<Self, Self::Error> {
      match index {
        ${patterns},
        _ => Err(format!("{} is not a valid index for ${rustifyCaps(node.name)}",index))
      }
    }
  }
  `;
}
function intoIndexImpl(node) {
    let type = "u32";
    let patterns = node.values.map((v)=>`Self::${rustifyCaps(v.name)} => ${v.index || "unreachable!()"}`).join(",");
    return `
  impl Into<${type}> for ${rustifyCaps(node.name)} {
    fn into(self) -> ${type} {
      match self {
        ${patterns},
      }
    }
  }
  `;
}
function getTypeName(t) {
    if (isNamed(t)) {
        return t.name;
    } else {
        const apexType = codegenType(t);
        throw new Error(`Can't represent an Apex union with primitive or non-named types as a Rust enum.` + ` Try turning "${apexType}" into an alias, e.g. "alias MyType = ${apexType}".`);
    }
}
class UnionVisitor3 extends SourceGenerator {
    config;
    visibility;
    constructor(u, context){
        super(u, context);
        this.config = context.config;
        this.visibility = visibility(this.root.name, this.config);
    }
    getSource() {
        const variants = this.root.types.map((t)=>{
            let isRecursive = isRecursiveType(t);
            let isHeapAllocated = t.kind === Kind.Map || t.kind === Kind.List;
            let baseType = mod8.apexToRustType(t, this.config);
            let typeString = isRecursive && !isHeapAllocated ? `Box<${baseType}>` : baseType;
            return `${getTypeName(t)}(${typeString})`;
        });
        let prefix = trimLines([
            rustDoc(this.root.description),
            deriveDirective(this.root.name, this.config),
            customAttributes(this.root.name, this.config)
        ]);
        return `
    ${prefix}
    ${this.visibility} enum ${rustifyCaps(this.root.name)}{
      ${variants.join(",")}
    }
    `;
    }
}
class RustBasic extends ContextWriter {
    constructor(writer){
        super(writer);
    }
    visitContextBefore(context) {
        this.append(generatedHeader(context.config.generatedHeader || [
            "THIS FILE IS GENERATED, DO NOT EDIT",
            "",
            `See https://apexlang.io for more information`
        ]));
        if (context.config.header) {
            if (Array.isArray(context.config.header)) {
                this.append(context.config.header.join("\n"));
            } else {
                this.append(context.config.header);
            }
        }
    }
    visitType(context) {
        this.append(new StructVisitor1(context.type, context).toString());
    }
    visitInterface(context) {
        this.append(new InterfaceVisitor3(context.interface, context).toString());
    }
    visitEnum(context) {
        this.append(new EnumVisitor3(context.enum, context).toString());
    }
    visitUnion(context) {
        this.append(new UnionVisitor3(context.union, context).toString());
    }
    visitFunction(context) {
        const vis = visibility(context.operation.name, context.config);
        this.append(genOperation(context.operation, vis, context.config));
    }
    visitAlias(context) {
        const { alias  } = context;
        let vis = visibility(alias.name, context.config);
        let prefix = rustDoc(alias.description);
        if (isNewType(alias.name, context.config)) {
            prefix = trimLines([
                prefix,
                customAttributes(alias.name, context.config),
                deriveDirective(alias.name, context.config)
            ]);
            customAttributes(alias.name, context.config), this.append(`
        ${prefix}
        ${vis} struct ${rustifyCaps(alias.name)}(${vis} ${mod8.apexToRustType(alias.type, context.config)});\n`);
        } else {
            this.append(`
        ${prefix}
        ${vis} type ${rustifyCaps(alias.name)} = ${mod8.apexToRustType(alias.type, context.config)};\n`);
        }
    }
}
const mod10 = {
    EnumVisitor: EnumVisitor3,
    InterfaceVisitor: InterfaceVisitor3,
    StructVisitor: StructVisitor1,
    UnionVisitor: UnionVisitor3
};
const mod11 = {
    default: RustBasic,
    RustBasic: RustBasic,
    utils: mod9,
    visitors: mod10
};
const translations3 = new Map([
    [
        "ID",
        "string"
    ],
    [
        "bytes",
        "ArrayBuffer"
    ],
    [
        "i64",
        "number"
    ],
    [
        "i32",
        "number"
    ],
    [
        "i16",
        "number"
    ],
    [
        "i8",
        "number"
    ],
    [
        "u64",
        "number"
    ],
    [
        "u32",
        "number"
    ],
    [
        "u16",
        "number"
    ],
    [
        "u8",
        "number"
    ],
    [
        "f64",
        "number"
    ],
    [
        "f32",
        "number"
    ],
    [
        "datetime",
        "Date"
    ]
]);
function defaultForAlias(context) {
    const aliases = context.config.aliases;
    if (aliases == undefined) {
        return ()=>undefined;
    }
    return function(named) {
        const i = aliases[named];
        if (i == undefined) {
            return undefined;
        }
        return i.default;
    };
}
function mapVals2(vd, sep, joinOn) {
    return vd.map((vd)=>`${vd.name}${sep} ${expandType3(vd.type, true)};`).join(joinOn);
}
function defValue2(context, fieldDef) {
    fieldDef.name;
    const type = fieldDef.type;
    if (fieldDef.default) {
        let returnVal = fieldDef.default.getValue();
        if (fieldDef.type.kind == Kind.Primitive) {
            var typeName = fieldDef.type.name;
            typeName = translations3.get(typeName) || typeName;
            returnVal = typeName == "string" ? strQuote2(returnVal) : returnVal;
        }
        return returnVal;
    }
    switch(type.kind){
        case Kind.Optional:
            return "null";
        case Kind.List:
        case Kind.Map:
            return `new ${expandType3(type, false)}()`;
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            var typeName = fieldDef.type.name;
            switch(typeName){
                case "ID":
                case "string":
                    return `''`;
                case "bool":
                    return "false";
                case "i8":
                case "u8":
                case "i16":
                case "u16":
                case "i32":
                case "u32":
                case "i64":
                case "u64":
                case "f32":
                case "f64":
                    return "0";
                case "bytes":
                    return "new ArrayBuffer(0)";
                case "datetime":
                    return "new Date()";
                default:
                    const def = defaultForAlias(context)(typeName);
                    if (def) {
                        return def;
                    }
                    return `new ${capitalize(typeName)}()`;
            }
    }
    return `???${expandType3(type, false)}???`;
}
function defaultValueForType2(type) {
    if (type.kind == Kind.Alias) {
        type = type.type;
    }
    switch(type.kind){
        case Kind.Optional:
            return "null";
        case Kind.List:
            return "new List()";
        case Kind.Map:
            return `new Map()`;
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            const name = type.name;
            switch(name){
                case "ID":
                case "string":
                    return `''`;
                case "bool":
                    return "false";
                case "i8":
                case "u8":
                case "i16":
                case "u16":
                case "i32":
                case "u32":
                case "i64":
                case "u64":
                case "f32":
                case "f64":
                    return "0";
                case "bytes":
                    return "new ArrayBuffer(0)";
                default:
                    return `new ${capitalize(name)}()`;
            }
    }
    return "???";
}
const strQuote2 = (s)=>{
    return `'${s}'`;
};
const expandType3 = (type, useOptional)=>{
    switch(type.kind){
        case Kind.Primitive:
        case Kind.Alias:
        case Kind.Enum:
        case Kind.Type:
        case Kind.Union:
            const namedValue = type.name;
            const translation = translations3.get(namedValue);
            if (translation != undefined) {
                return translation;
            }
            return namedValue;
        case Kind.Map:
            return `Map<${expandType3(type.keyType, true)},${expandType3(type.valueType, true)}>`;
        case Kind.List:
            return `Array<${expandType3(type.type, true)}>`;
        case Kind.Optional:
            let expanded = expandType3(type.type, true);
            if (useOptional) {
                return `${expanded} | undefined`;
            }
            return expanded;
        default:
            return "unknown";
    }
};
class AliasVisitor3 extends BaseVisitor {
    visitAlias(context) {
        const alias = context.alias;
        const aliases = context.config.aliases;
        if (aliases && aliases[alias.name] && !aliases[alias.name].type) {
            return;
        }
        this.write(formatComment("// ", alias.description));
        this.write(`export type ${alias.name} = ${expandType3(alias.type, false)}\n\n`);
        super.triggerTypeField(context);
    }
}
function fieldName1(annotated, name) {
    const rename = renamed(annotated);
    if (rename != undefined) {
        return rename;
    }
    return name;
}
function methodName1(annotated, name) {
    return fieldName1(annotated, name);
}
function opsAsFns2(ops) {
    return ops.map((op)=>{
        return `function ${op.name}(${mapArgs1(op.parameters)}): ${expandType3(op.type, true)} {\n}`;
    }).join("\n");
}
function mapArgs1(params) {
    return params.map((param)=>{
        return mapArg1(param);
    }).join(", ");
}
function mapArg1(param) {
    return `${param.name}: ${expandType3(param.type, true)}`;
}
function isNode1(o) {
    for (const field of o.fields){
        if (field.name.toLowerCase() == "id") {
            return true;
        }
    }
    return false;
}
function varAccessArg2(variable, params) {
    return params.map((param)=>{
        return `${variable}.${param.name}`;
    }).join(", ");
}
class ClassVisitor1 extends BaseVisitor {
    visitTypeBefore(context) {
        super.triggerTypeBefore(context);
        const t = context.type;
        this.write(formatComment("// ", t.description));
        if (!t.name.endsWith("Args")) {
            this.write(`export `);
        }
        this.write(`class ${t.name} {\n`);
    }
    visitTypeField(context) {
        const field = context.field;
        this.write(formatComment("  // ", field.description));
        const et = expandType3(field.type, true);
        if (et.indexOf("Date") != -1) {
            this.write(`@Type(() => Date) `);
        }
        this.write(`  @Expose() ${field.name}: ${et};\n`);
        super.triggerTypeField(context);
    }
    visitTypeAfter(context) {
        this.write(`\n`);
        const ctor = new ConstructorVisitor(this.writer);
        context.type.accept(context.clone({
            type: context.type
        }), ctor);
        this.write(`}\n\n`);
        super.triggerTypeAfter(context);
    }
}
class ConstructorVisitor extends BaseVisitor {
    visitTypeBefore(context) {
        super.triggerTypeBefore(context);
        const t = context.type;
        this.write(`constructor({\n`);
        this.write(t.fields.map((field)=>`${field.name} = ${defValue2(context, field)}`).join(`,\n`));
        this.write(`}: {`);
        this.write(t.fields.map((field)=>`${field.name}?: ${expandType3(field.type, true)}`).join(`,\n`));
        this.write(`} = {}) {\n`);
    }
    visitTypeField(context) {
        const field = context.field;
        this.write(`  this.${field.name} = ${field.name}\n`);
        super.triggerTypeField(context);
    }
    visitTypeAfter(context) {
        this.write(`}\n`);
        super.triggerTypeAfter(context);
    }
}
class ArgsVisitor1 extends BaseVisitor {
    visitOperation(context) {
        const { interface: iface , operation  } = context;
        if (noCode(operation)) {
            return;
        }
        if (operation.parameters.length == 0 || operation.isUnary()) {
            return;
        }
        const argObject = convertOperationToType(context.getType.bind(context), iface, operation);
        const args = new ClassVisitor1(this.writer);
        argObject.accept(context.clone({
            type: argObject
        }), args);
        super.triggerOperation(context);
    }
}
class HandlerVisitor1 extends BaseVisitor {
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { interface: iface  } = context;
        this.write(formatComment("// ", iface.description));
        this.write(`export interface ${iface.name} {
      \n`);
    }
    visitOperation(context) {
        const { interface: iface , operation  } = context;
        if (noCode(operation)) {
            return;
        }
        let opVal = "";
        this.write(formatComment("  // ", operation.description));
        opVal += `${camelCase(operation.name)}?: (`;
        if (operation.isUnary()) {
            opVal += mapArg1(operation.unaryOp());
        } else {
            opVal += mapArgs1(operation.parameters);
        }
        opVal += `) => Promise<${expandType3(operation.type, true)}>\n`;
        this.write(opVal);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`}\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class ImportsVisitor3 extends BaseVisitor {
    imports = {};
    visitNamespaceAfter(context) {
        const modules = {};
        for(const key in this.imports){
            const i = this.imports[key];
            if (i.from && i.import) {
                var imports = modules[i.from];
                if (!imports) {
                    imports = [];
                    modules[i.from] = imports;
                }
                imports.push(i.import);
            }
        }
        for(const module1 in modules){
            const imports1 = modules[module1];
            imports1.sort();
            this.write(`import { ${imports1.join(", ")} } from "${module1}";\n`);
        }
    }
    addType(name, i) {
        if (i == undefined || i.import == undefined) {
            return;
        }
        if (this.imports[name] === undefined) {
            this.imports[name] = i;
        }
    }
    checkType(context, type) {
        const aliases = context.config.aliases || {};
        switch(type.kind){
            case Kind.Type:
                const named = type;
                const i = aliases[named.name];
                this.addType(named.name, i);
                break;
            case Kind.List:
                const list = type;
                this.checkType(context, list.type);
                break;
            case Kind.Map:
                const map = type;
                this.checkType(context, map.keyType);
                this.checkType(context, map.valueType);
                break;
            case Kind.Optional:
                const optional = type;
                this.checkType(context, optional.type);
                break;
        }
    }
    visitParameter(context) {
        this.checkType(context, context.parameter.type);
    }
    visitOperation(context) {
        this.checkType(context, context.operation.type);
    }
    visitTypeField(context) {
        this.checkType(context, context.field.type);
    }
}
class InterfaceVisitor4 extends BaseVisitor {
    stateful;
    constructor(writer, stateful = false){
        super(writer);
        this.stateful = stateful;
    }
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { interface: iface  } = context;
        this.write(formatComment("// ", iface.description));
        this.write(`export interface ${iface.name} {
      \n`);
    }
    visitOperation(context) {
        const operation = context.operation;
        let opVal = "";
        this.write(formatComment("  // ", operation.description));
        opVal += `${camelCase(operation.name)}(`;
        if (operation.isUnary()) {
            opVal += mapArg1(operation.unaryOp());
        } else {
            opVal += mapArgs1(operation.parameters);
        }
        opVal += `): Promise<${expandType3(operation.type, true)}>\n`;
        this.write(opVal);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`}\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class InterfacesVisitor3 extends BaseVisitor {
    visitNamespaceBefore(context) {
        this.write(`import { Expose, Type } from "class-transformer";\n`);
        const e = new ImportsVisitor3(this.writer);
        context.namespace.accept(context, e);
        this.write(`\n`);
    }
    visitInterfaceBefore(context) {
        const iface = new InterfaceVisitor4(this.writer);
        context.interface.accept(context, iface);
    }
    visitAlias(context) {
        const e = new AliasVisitor3(this.writer);
        context.alias.accept(context, e);
    }
    visitType(context) {
        const clazz = new ClassVisitor1(this.writer);
        context.type.accept(context, clazz);
    }
}
class ProviderVisitor1 extends BaseVisitor {
    visitInterfaceBefore(context) {
        const { interface: iface  } = context;
        this.write(`export class ${iface.name}Impl implements ${iface.name} {
    private adapter: IAdapter;

    constructor(adapter: IAdapter) {
        this.adapter = adapter;
    }\n\n`);
    }
    visitOperation(context) {
        const { interface: iface  } = context;
        this.write(`\n`);
        const operation = context.operation;
        this.write(formatComment("  // ", operation.description));
        this.write(`  async ${camelCase(operation.name)}(`);
        operation.parameters.map((param, index)=>{
            if (index > 0) {
                this.write(`, `);
            }
            this.write(`${param.name}: ${expandType3(param.type, true)}`);
        });
        var expandedType = expandType3(operation.type, true);
        this.write(`): Promise<${expandedType}> {\n`);
        this.write(`  `);
        const retVoid = isVoid(operation.type);
        if (retVoid) {
            expandedType = "undefined";
        }
        const path = "/" + context.namespace.name + "." + iface.name + "/" + operation.name;
        if (operation.parameters.length == 0) {
            this.write(`return this.adapter.requestResponse(${expandedType}, ${strQuote2(path)})\n`);
        } else if (operation.isUnary()) {
            this.write(`return this.adapter.requestResponse(${expandedType}, ${strQuote2(path)}, ${operation.unaryOp().name})\n`);
        } else {
            this.write(`const inputArgs: ${capitalize(iface.name)}${capitalize(operation.name)}Args = {\n`);
            operation.parameters.map((param)=>{
                const paramName = param.name;
                this.write(`  ${paramName},\n`);
            });
            this.write(`}\n`);
            this.write(`return this.adapter.requestResponse(${expandedType},
      ${strQuote2(path)},
      inputArgs
    )`);
        }
        if (isVoid(operation.type)) {
            this.write(`.then()\n`);
        }
        this.write(`;\n`);
        this.write(`  }\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        if (!isProvider(context)) {
            super.triggerInterfaceAfter(context);
            return;
        }
        const { interface: iface  } = context;
        this.write(`}\n\n`);
        this.write(`export var ${camelCase(iface.name)} = new ${iface.name}Impl(adapter);\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class ScaffoldVisitor3 extends BaseVisitor {
    visitNamespaceBefore(context) {
        const adapter = new AdapterTypesVisitor1(this.writer);
        context.namespace.accept(context, adapter);
        const types = new TypesVisitor2(this.writer);
        context.namespace.accept(context, types);
        this.write(`\n`);
    }
    visitInterfaceBefore(context) {
        if (isHandler(context)) {
            const impl = new ImplVisitor1(this.writer);
            context.interface.accept(context, impl);
        }
    }
    visitNamespaceAfter(context) {
        this.write(`\nstart();\n`);
    }
}
class ImplVisitor1 extends BaseVisitor {
    stateful;
    constructor(writer, stateful = false){
        super(writer);
        this.stateful = stateful;
    }
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { interface: iface  } = context;
        this.write(`class ${iface.name}Impl {`);
    }
    visitOperation(context) {
        const { operation  } = context;
        if (noCode(operation)) {
            return;
        }
        this.write(`\n`);
        let opVal = "";
        opVal += `async ${camelCase(operation.name)}(`;
        if (this.stateful) {
            opVal += `ctx: Context`;
            if (operation.parameters.length > 0) {
                opVal += `, `;
            }
        }
        if (operation.isUnary()) {
            opVal += mapArg1(operation.unaryOp());
        } else {
            opVal += mapArgs1(operation.parameters);
        }
        opVal += `): Promise<${expandType3(operation.type, true)}> {\n`;
        this.write(opVal);
        if (!isVoid(operation.type)) {
            const dv = defaultValueForType2(operation.type);
            this.write(`  return ${dv};`);
        } else {
            this.write(`  return;\n`);
        }
        this.write(`}\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`}\n\n`);
        const name = context.interface.name;
        this.write(`register${pascalCase(name)}(new ${name}Impl());\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class AdapterTypesVisitor1 extends BaseVisitor {
    visitNamespaceBefore(content) {
        this.write(`import { start`);
    }
    visitInterface(context) {
        const { interface: iface  } = context;
        if (isHandler(context)) {
            this.write(`, register${pascalCase(iface.name)}`);
        }
        if (isProvider(context)) {
            this.write(`, ${camelCase(iface.name)}`);
        }
    }
    visitNamespaceAfter(content) {
        this.write(` } from "./adapter";\n`);
    }
}
class TypesVisitor2 extends BaseVisitor {
    hasObjects = false;
    found = new Set();
    addImport(name) {
        if (!this.found.has(name)) {
            this.found.add(name);
            if (!this.hasObjects) {
                this.write(`import { `);
                this.hasObjects = true;
            } else {
                this.write(`, `);
            }
            this.write(name);
        }
    }
    addType(t) {
        switch(t.kind){
            case Kind.Type:
                const v = t;
                this.addImport(v.name);
                break;
            case Kind.Optional:
                const o = t;
                this.addType(o.type);
                break;
            case Kind.List:
                const l = t;
                this.addType(l.type);
                break;
            case Kind.Map:
                const m = t;
                this.addType(m.keyType);
                this.addType(m.valueType);
        }
    }
    visitOperation(context) {
        const operation = context.operation;
        this.addType(operation.type);
    }
    visitParameter(context) {
        const parameter = context.parameter;
        this.addType(parameter.type);
    }
    visitNamespaceBefore(context) {}
    visitNamespaceAfter(context) {
        if (this.hasObjects) {
            this.write(` } from "./interfaces";\n\n`);
        }
    }
}
class WrapperVisitor1 extends BaseVisitor {
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { interface: iface  } = context;
        this.write(`export function register${iface.name}(h: ${iface.name}): void {\n`);
    }
    visitOperation(context) {
        const { interface: iface , operation  } = context;
        if (noCode(operation)) {
            return;
        }
        const path = "/" + context.namespace.name + "." + iface.name + "/" + operation.name;
        this.write(`  if (h.${camelCase(operation.name)}) {
      adapter.registerRequestResponseHandler("${path}",
            (_: Metadata, input: any): Promise<any> => {\n`);
        if (operation.parameters.length == 0) {
            this.write(`return h.${camelCase(operation.name)}()\n`);
        } else if (operation.isUnary()) {
            this.write(`const payload = plainToClass(${expandType3(operation.unaryOp().type, true)}, input);\n`);
            this.write(`return h.${camelCase(operation.name)}(payload);\n`);
        } else {
            this.write(`const inputArgs = plainToClass(${capitalize(iface.name)}${capitalize(operation.name)}Args, input);\n`);
            this.write(`return h.${camelCase(operation.name)}(`);
            operation.parameters.map((param, i)=>{
                const paramName = param.name;
                if (i > 0) {
                    this.write(`, `);
                }
                this.write(`inputArgs.${paramName}`);
            });
            this.write(`);\n`);
        }
        this.write(`  }\n`);
        this.write(`  );\n`);
        this.write(`  }\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`}\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
class WrapperStatefulVisitor1 extends BaseVisitor {
    visitInterfaceBefore(context) {
        super.triggerInterfaceBefore(context);
        const { namespace , interface: iface  } = context;
        const ns = namespace.name + "." + iface.name;
        this.write(`export function register${iface.name}(h: ${iface.name}): void {
        handlers.registerStatefulHandler(
          "${ns}",
          "deactivate",
          stateManager.deactivateHandler("${ns}", h)
        );\n`);
    }
    visitOperation(context) {
        const { interface: iface , operation  } = context;
        if (noCode(operation)) {
            return;
        }
        const namespace = context.namespace;
        const ns = namespace.name + "." + iface.name;
        this.write(`handlers.registerStatefulHandler(
            "${ns}",
            "${operation.name}",
            (id: string, input: ArrayBuffer): Promise<ArrayBuffer> => {\n`);
        if (operation.parameters.length == 0) {
            this.write(`const sctx = stateManager.toContext("${ns}", id, h);\n`);
            this.write(`return h.${camelCase(operation.name)}(sctx)\n`);
        } else if (operation.isUnary()) {
            this.write(`const decoded = handlers.codec.decoder(input);
        const payload = plainToClass(${expandType3(operation.unaryOp().type, true)}, decoded);\n`);
            this.write(`const sctx = stateManager.toContext("${ns}", id, h);\n`);
            this.write(`return h.${camelCase(operation.name)}(sctx, payload)\n`);
        } else {
            this.write(`const inputArgs = handlers.codec.decoder(input) as ${capitalize(iface.name)}${capitalize(operation.name)}Args;\n`);
            this.write(`const sctx = stateManager.toContext("${ns}", id, h);\n`);
            this.write(`return h.${camelCase(operation.name)}(sctx`);
            operation.parameters.map((param, i)=>{
                const paramName = param.name;
                this.write(`, inputArgs.${paramName}`);
            });
            this.write(`)\n`);
        }
        if (!isVoid(operation.type)) {
            this.write(`.then((result) => sctx.response(result))\n`);
            this.write(`.then((result) => handlers.codec.encoder(result));\n`);
        } else {
            this.write(`.then(() => new ArrayBuffer(0));\n`);
        }
        this.write(`  }\n`);
        this.write(`  );\n`);
        super.triggerOperation(context);
    }
    visitInterfaceAfter(context) {
        this.write(`}\n\n`);
        super.triggerInterfaceAfter(context);
    }
}
const mod12 = {
    default: InterfacesVisitor3,
    defaultForAlias,
    AliasVisitor: AliasVisitor3,
    mapVals: mapVals2,
    defValue: defValue2,
    defaultValueForType: defaultValueForType2,
    strQuote: strQuote2,
    expandType: expandType3,
    fieldName: fieldName1,
    methodName: methodName1,
    opsAsFns: opsAsFns2,
    mapArgs: mapArgs1,
    mapArg: mapArg1,
    isNode: isNode1,
    varAccessArg: varAccessArg2,
    translations: translations3,
    ArgsVisitor: ArgsVisitor1,
    ClassVisitor: ClassVisitor1,
    HandlerVisitor: HandlerVisitor1,
    ImportsVisitor: ImportsVisitor3,
    InterfaceVisitor: InterfaceVisitor4,
    InterfacesVisitor: InterfacesVisitor3,
    ProviderVisitor: ProviderVisitor1,
    ScaffoldVisitor: ScaffoldVisitor3,
    WrapperVisitor: WrapperVisitor1,
    WrapperStatefulVisitor: WrapperStatefulVisitor1
};
export { mod3 as cs };
export { mod2 as go };
export { mod4 as jsonSchema };
export { mod5 as openapiv3 };
export { mod6 as proto };
export { mod7 as python };
export { mod1 as rest };
export { mod11 as rust };
export { mod12 as typescript };
export { mod as utils };

