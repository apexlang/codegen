directive @path(value: string) on NAMESPACE | INTERFACE | ROLE | OPERATION

directive @GET on OPERATION
directive @POST on OPERATION
directive @PUT on OPERATION
directive @PATCH on OPERATION
directive @DELETE on OPERATION

directive @query on PARAMETER | FIELD