package marshal.news.index.simple;

import marshal.news.index.simple.service.MyService;
import marshal.news.index.simple.service.MyServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {
    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
