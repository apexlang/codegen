directive @info(
  title: string
  description: string?
  termsOfService: string?
  contact: Contact?
  license: License?
  version: string
) on NAMESPACE

type Contact @novisit {
  name: string
  url: string
  email: string
}

type License @novisit {
  name: string
  url: string
}

directive @host(value: string) on NAMESPACE
directive @schemes(value: [string]) on NAMESPACE
directive @consumes(value: [string]) on NAMESPACE
directive @produces(value: [string]) on NAMESPACE

directive @password on PARAMETER | FIELD

directive @response(
  description: string,
  status: StatusCode,
  returns: string?,
  examples: { string : string }
) on OPERATION
#require @path on SELF | INTERFACE | ROLE | NAMESPACE

enum StatusCode @novisit {
  OK = 200 as "OK"
  CREATED = 201 as "Created"
  NOT_FOUND = 400 as "Not Found"
  DEFAULT = 999 as "Default"
}

directive @externalDocs(
  description: string?,
  url: string?
) on NAMESPACE | OPERATION
