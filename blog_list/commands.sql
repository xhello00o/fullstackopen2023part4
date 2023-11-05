CREATE TABLE
    blogs (
        id SERIAL PRIMARY KEY,
        author Text,
        url text not null,
        title text NOT NULL,
        likes int DEFAULT 0
    )

