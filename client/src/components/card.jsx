import Card from 'react-bootstrap/Card';

const TextExample=({customer})=> {
  const {name,contactInfo} = customer
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{contactInfo.phone
          }</Card.Subtitle>
        <Card.Text>
          {contactInfo.upi}{contactInfo.email}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TextExample;
