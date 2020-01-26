package marshal.news.index.simple.service;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class SearchServiceImpl implements SearchService {

    @Autowired
    private Set<Analyzer> analyzerSet;

    private int maxResults = 5;

    @Override
    public void search(String keyword) {

        List<IndexReader> indexReaders = new ArrayList<>();

        for (Analyzer analyzer : analyzerSet) {
            String className = analyzer.getClass().getName();
            Path indexPath = Paths.get("index-data/" + className);

            System.out.println("==== " + className + " ====");

            try {
                Directory directory = FSDirectory.open(indexPath);

                IndexReader reader = DirectoryReader.open(directory);
                IndexSearcher searcher = new IndexSearcher(reader);
                QueryParser parser = new QueryParser("content", analyzer);
                parser.setDefaultOperator(QueryParser.Operator.AND);

                Query query = parser.parse(keyword);

                TopDocs docs = searcher.search(query, maxResults);

                for (ScoreDoc d : docs.scoreDocs) {
                    Document document = searcher.doc(d.doc);
                    System.out.println("title: " + document.get("title"));
                    System.out.println("content: \n ---------> \n" + document.get("content") + "\n <--------- ");
                    System.out.println("Score: " + d.score);
                    System.out.println("=========================== \n");
                }

                reader.close();
                directory.close();

            } catch (IOException | ParseException e) {
                throw new RuntimeException(e);
            }

            System.out.println(">>>> " + className + " <<<< \n\n");
        }


    }
}
