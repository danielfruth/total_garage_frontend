import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

// Component for editing past entries
function Edit(props) {
  const [form, setForm] = useState({
    model: '',
    miles: '',
    repair: '',
    year: '',
    make: ''
  });
  const [data, setData] = useState('');
  const [createdId, setCreatedId] = useState('');
  const id = props.match.params.id;

  // gets specific data by id on component mount
  useEffect(() => {
    fetch(`https://total-garage.herokuapp.com/garage/repairs/${id}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  // updates data from api for specific element
  const handleEdit = e => {
    e.preventDefault();

    // uses data already in field, or any changed field
    const repair = {
      year: form.year ? form.year : data.year,
      make: form.make ? form.make : data.make,
      model: form.model ? form.model : data.model,
      miles: form.miles ? form.miles : data.miles,
      repair: form.repair ? form.repair : data.repair
    };
    fetch(`https://total-garage.herokuapp.com/garage/repairs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
      mode: 'cors',
      body: JSON.stringify(repair)
    })
      .then(response => response.json())
      .then(data => {
        setCreatedId(data.id);
      });
  };

  // updates var form as you type
  const handleChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    setForm({ ...form, [name]: value });
  };

  // thanks user for submission
  if (createdId) {
    return <Redirect to="/thankyou" />;
  }

  // allows user to see form if logged in
  if (props.loggedIn) {
    return (
      <div className="form-container">
        <Form onSubmit={handleEdit}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Year:</Form.Label>
              <Form.Control
                type="text"
                name="year"
                onChange={handleChange}
                defaultValue={data.year}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Make:</Form.Label>
              <Form.Control
                type="text"
                name="make"
                onChange={handleChange}
                defaultValue={data.make}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Model:</Form.Label>
              <Form.Control
                type="text"
                name="model"
                onChange={handleChange}
                defaultValue={data.model}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Miles:</Form.Label>
              <Form.Control
                type="text"
                name="miles"
                onChange={handleChange}
                defaultValue={data.miles}
              />
            </Form.Group>
          </Form.Row>
          <Form.Group>
            <Form.Label>Repair:</Form.Label>
            <Form.Control
              type="text"
              name="repair"
              onChange={handleChange}
              defaultValue={data.repair}
              as="textarea"
              rows="3"
            />
          </Form.Group>
          <Button variant="outline-light" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  } else {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Access Denied</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>You have to be logged in to do that.</p>
        </Modal.Body>

        <Modal.Footer>
          <a href="/signup">
            <Button variant="warning">Signup</Button>
          </a>

          <a href="/login">
            <Button variant="primary">Login</Button>
          </a>

          <a href="/">
            <Button variant="danger">Close</Button>
          </a>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

export default Edit;
