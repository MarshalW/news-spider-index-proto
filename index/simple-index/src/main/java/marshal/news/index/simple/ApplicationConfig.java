package marshal.news.index.simple;

import marshal.news.index.simple.lucene.ik.IKAnalyzer;
import marshal.news.index.simple.service.IndexService;
import marshal.news.index.simple.service.IndexServiceImpl;
import marshal.news.index.simple.service.SearchService;
import marshal.news.index.simple.service.SearchServiceImpl;
import org.ansj.lucene7.AnsjAnalyzer;
import org.apache.lucene.analysis.Analyzer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {
    @Bean
    public IndexService indexService() {
        return new IndexServiceImpl();
    }

    @Bean
    public SearchService searchService() {
        return new SearchServiceImpl();
    }

    @Bean
    public Analyzer ikAnalyzer() {
        return new IKAnalyzer();
    }

    @Bean
    public Analyzer ansjAnalyzer() {
        return new AnsjAnalyzer(AnsjAnalyzer.TYPE.index_ansj);
    }
}
