CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer NOT NULL DEFAULT 0
);


INSERT INTO blogs (author, url, title, likes) VALUES
('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 7),
('Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful', 5),
('Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', 'Type wars', 12);