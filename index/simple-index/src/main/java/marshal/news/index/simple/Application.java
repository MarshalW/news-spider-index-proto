package marshal.news.index.simple;

import marshal.news.index.simple.service.MyService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(ApplicationConfig.class);
        MyService service=context.getBean(MyService.class);
        service.sayHello();
    }
}
