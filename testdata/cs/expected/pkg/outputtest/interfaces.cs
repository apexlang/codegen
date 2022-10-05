namespace Urlshortener.V1 {

  // The URL shortening service.
  public interface Shortener
  {
    // Shorten a URL and return a generated identifier.
    public Url Shorten(string url);

    // Return the URL using the generated identifier.
    public Url Lookup(string id);

  }

  // Repository handles loading and storing shortened URLs.
  public interface Repository
  {
    // Load the URL by its identifier.
    public Url LoadById(string id);

    // Load the ID by its URL.
    public Url LoadByUrl(string url);

    // Store a URL and its identifier.
    public object StoreUrl(Url url);

  }

  // URL encapsulates the dynamic identifier and the URL it points to.
public record Url
  {
    // The dynamically generated URL identifier.
	 public string Id   { get; set; }

    // The original URL that was shortened.
	 public string Url   { get; set; }

  }

}
