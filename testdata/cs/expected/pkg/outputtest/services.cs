namespace Urlshortener.V1 {

  public class ShortenerImpl : Shortener {
    private Repository repository;

    public ShortenerImpl (RepositoryImpl repository) {
      this.repository = repository;
    }

    // Shorten a URL and return a generated identifier.
    public Url Shorten(string url)
    {
      return new Url(); // TODO: Provide implementation.
    }

    // Return the URL using the generated identifier.
    public Url Lookup(string id)
    {
      return new Url(); // TODO: Provide implementation.
    }

  }

}
