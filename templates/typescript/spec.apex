namespace "greeting"

interface Greeter @service {
  sayHello(name: string): string
}
