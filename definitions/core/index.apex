directive @service on INTERFACE
directive @events on INTERFACE
directive @provider on INTERFACE

directive @n(value: i32) on FIELD | PARAMETER

# Specify dependencies on providers.
directive @uses(value: [any]) on INTERFACE

# Prevent operation from having generated code.
directive @nocode on OPERATION

directive @deprecated(value: string?) on INTERFACE | OPERATION
