package marshal.news.index.simple;

import marshal.news.index.simple.service.IndexService;
import marshal.news.index.simple.service.SearchService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {

    static private AnnotationConfigApplicationContext context;

    public static void main(String[] args) {
        context = new AnnotationConfigApplicationContext(ApplicationConfig.class);

        String command = null;

        if (args.length > 0) {
            command = args[0];

            if (command.equals("index")) {
                if (args.length > 1) {
                    String filePath = args[1];
                    index(filePath);
                }
            }

            if (command.equals("search")) {
                if (args.length > 1) {
                    String keyword = args[1];
                    search(keyword);
                }

            }
        }
    }

    private static void index(String filePath) {
        IndexService service = context.getBean(IndexService.class);
        service.generateIndex(filePath);
    }

    private static void search(String keyword) {
        SearchService service = context.getBean(SearchService.class);
        service.search(keyword);
    }
}
