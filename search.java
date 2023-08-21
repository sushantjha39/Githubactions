import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;

public class GoogleSearch {
    public static void main(String[] args) {
        String searchQuery = "GitHub Actions"; // Replace with your search query

        try {
            // Perform Google search
            Document document = Jsoup.connect("https://www.google.com/search?q=" + searchQuery).get();

            // Extract search results
            Elements searchResults = document.select("div.rc");
            for (Element result : searchResults) {
                Element titleElement = result.selectFirst("h3");
                Element urlElement = result.selectFirst("a");

                if (titleElement != null && urlElement != null) {
                    String title = titleElement.text();
                    String url = urlElement.attr("href");
                    System.out.println(title + " - " + url);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
