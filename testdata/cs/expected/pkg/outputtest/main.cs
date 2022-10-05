namespace Urlshortener.V1 {

public class MainClass {

	 public static void Main(String[] args) {
		 ShortenerImpl shortener = new ShortenerImpl(new RepositoryImpl());
		 }
	}
}
