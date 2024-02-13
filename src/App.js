import React, { useState, useEffect } from 'react';


import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import './App.css';


function App() {
  const [template, setTemplate] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([['', '']]);
  const [output, setOutput] = useState('');
  const [showToast, setShowToast] = useState(false); // State to control toast visibility

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const newKeyValuePairs = Object.entries(params);
    const initialTemplate = "Hello, I am interested in {{Job Title}} at your {{Company Name}}.";
    setTemplate(initialTemplate);
    setKeyValuePairs(newKeyValuePairs.length ? newKeyValuePairs : [['', '']]);
    
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(false); // Show toast when text is generated

    let result = template;
    keyValuePairs.forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    setOutput(result);
    setShowToast(true); // Show toast when text is generated
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, ['', '']]);
  };
  const exportKeywords = () => {
    const params = new URLSearchParams();

    keyValuePairs.forEach(([key, value]) => {
      // Check if key and value are not empty strings
      if (key.trim() !== '' && value.trim() !== '') {
        params.append(key.trim(), value.trim());
      }
    });
    copyToClipboard(window.location.origin + "/" + window.location.pathname + "?" + params.toString())
  };
  const copyOutput = () => {
    copyToClipboard(output);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard:', text);
        // You can optionally show a success message here
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
        // You can optionally show an error message here
      });
  }; 

  const handleChange = (i, type, e) => {
    let newArr = [...keyValuePairs];
    newArr[i][type] = e.target.value;
    setKeyValuePairs(newArr);
  };

  const handleRemove = (i) => {
    let newArr = [...keyValuePairs];
    newArr.splice(i, 1);
    setKeyValuePairs(newArr);
  };

  const ExampleToast = ({ children }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000 * 2); // Adjust duration as needed (5000 milliseconds = 5 seconds)

      return () => {
        clearTimeout(timer);
      };
    }, []); // Effect runs once on mount

    return (
      <Toast show={showToast} onClose={() => setShowToast(false)}>
      <Toast.Header>
        <strong className="mr-auto">Generated</strong>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Container className="p-5 mb-4 bg-light rounded-3">
            <h1 className="header">Cover Letter Generator</h1>
            <ExampleToast>Cover letter generated<span role="img" aria-label="tada">🎉</span></ExampleToast>
          </Container>
        </Row>
        <Row>
          <Col className="xs-6">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-12" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Enter the template</Form.Label>
                <Form.Control as="textarea" rows={10} value={template} onChange={(e) => setTemplate(e.target.value)} />
                <Button type="submit">Generate Text</Button>
              </Form.Group>
            </Form>
          </Col>
          <Col className="xs-6">
            <Form.Group className="mb-12" controlId="exampleForm.ControlTextarea2">
              <Form.Label>Generated letter</Form.Label>
              <Form.Control as="textarea" rows={10} value={output} readOnly />
              <Button onClick={copyOutput} variant='secondary'>Copy</Button>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="xs-6">
            <h2>Keywords</h2>
            <Button type="button" onClick={addKeyValuePair} variant="success">+</Button>
            <Button type="button" onClick={exportKeywords} variant="secondary">Export</Button>
            {keyValuePairs.map(([key, value], i) => (
              <Container key={i}>
                <InputGroup className="mb-1">
                  <Form.Control placeholder="Key" value={key} onChange={(e) => handleChange(i, 0, e)} />
                  <InputGroup.Text id="basic-addon2">{'=>'}</InputGroup.Text>
                  <Form.Control placeholder="Value" value={value} onChange={(e) => handleChange(i, 1, e)} />
                  <Button type="button" onClick={() => handleRemove(i)} variant="outline-danger"> - </Button>
                </InputGroup>
              </Container>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
