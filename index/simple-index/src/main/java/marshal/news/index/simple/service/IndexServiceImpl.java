package marshal.news.index.simple.service;

import com.jayway.jsonpath.JsonPath;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.FieldType;
import org.apache.lucene.index.IndexOptions;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

public class IndexServiceImpl implements IndexService {

    @Autowired
    private Set<Analyzer> analyzerSet;

    private void generateIndexFromFile(String sourceFile) throws IOException {
        Scanner scanner = null;
        List<IndexWriter> indexWriters = createIndexWriters();

        try {
            scanner = new Scanner(new File(sourceFile));

            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();

                if (line != null && !line.isEmpty() && !line.startsWith(">") && line.contains("\"news\"")) {
                    Map newsMap = JsonPath.read(line, "$.message.news");
                    addToIndex(newsMap, indexWriters);
                }

            }
            closeIndexWriters(indexWriters);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    private List<IndexWriter> createIndexWriters() throws IOException {
        List<IndexWriter> indexWriters = new ArrayList<>();

        for (Analyzer analyzer : this.analyzerSet) {
            String className = analyzer.getClass().getName();

            IndexWriterConfig config = new IndexWriterConfig(analyzer);
            config.setOpenMode(IndexWriterConfig.OpenMode.CREATE);
            Path indexPath = Paths.get("index-data/" + className);
            Directory directory = FSDirectory.open(indexPath);
            IndexWriter indexWriter = new IndexWriter(directory, config);

            indexWriters.add(indexWriter);
        }

        return indexWriters;
    }

    private void closeIndexWriters(List<IndexWriter> indexWriters) throws IOException {
        for (IndexWriter indexWriter : indexWriters) {
            indexWriter.commit();
            indexWriter.close();
        }
    }

    private void addToIndex(Map newsMap, List<IndexWriter> indexWriters) throws IOException {
        String contentId = (String) newsMap.get("contentId");
        String title = (String) newsMap.get("title");
        Long publishDate = (Long) newsMap.get("publishDate");
        String content = (String) newsMap.get("content");
        String url = (String) newsMap.get("url");

        Document document = new Document();

        // id
        FieldType type = new FieldType();
        type.setIndexOptions(IndexOptions.DOCS);
        type.setStored(true);
        document.add(new Field("contentId", contentId, type));

        // title
        type = new FieldType();
        type.setIndexOptions(IndexOptions.DOCS_AND_FREQS_AND_POSITIONS_AND_OFFSETS);
        type.setStored(true);
        type.setTokenized(true);
        document.add(new Field("title", title, type));

        // content
        type = new FieldType();
        type.setIndexOptions(IndexOptions.DOCS_AND_FREQS_AND_POSITIONS_AND_OFFSETS);
        type.setStored(true);
        type.setTokenized(true);
        type.setStoreTermVectors(true);
        type.setStoreTermVectorPositions(true);
        type.setStoreTermVectorOffsets(true);
        type.setStoreTermVectorPayloads(true);
        document.add(new Field("content", content, type));

//        TODO publishDate, url

        for (IndexWriter indexWriter : indexWriters) {
            indexWriter.addDocument(document);
        }
    }

    @Override
    public void generateIndex(String sourceFile) {
        try {
            generateIndexFromFile(sourceFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
