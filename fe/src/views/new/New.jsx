import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import draftToHtml from "draftjs-to-html";
import axios from "../auth/axiosConfig"; // Importata configurazione Axios

const NewBlogPost = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleReset = () => {
    setTitle("");
    setCover("");
    setCategory("");
    setReadTime("");
    setAuthor("");
    setEditorState(EditorState.createEmpty());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const newPost = {
      title,
      cover,
      category,
      content,
      readTime: { value: readTime, unit: "minutes" },
      author
    };

    console.log("Submitting post:", newPost);

    try {
      const response = await axios.post("/blogPosts", newPost);
      console.log("Blog post created:", response.data);
    } catch (error) {
      console.error("There was an error creating the blog post!", error);
      setError(error);
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-title" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="blog-cover" className="mt-3">
          <Form.Label>Cover</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Cover" 
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control 
            size="lg" 
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Seleziona una categoria</option>
            <option value="Categoria 1">Categoria 1</option>
            <option value="Categoria 2">Categoria 2</option>
            <option value="Categoria 3">Categoria 3</option>
            <option value="Categoria 4">Categoria 4</option>
            <option value="Categoria 5">Categoria 5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Editor 
            editorState={editorState} 
            onEditorStateChange={handleEditorChange} 
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
        </Form.Group>
        <Form.Group controlId="blog-readtime" className="mt-3">
          <Form.Label>Readtime</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Read time"  
            type="number"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="blog-author" className="mt-3">
          <Form.Label>Autore</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark" onClick={handleReset}>
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
      {error && <div className="mt-3 text-danger">Errore nella creazione del post: {error.message}</div>}
    </Container>
  );
};

export default NewBlogPost;
