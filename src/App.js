import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import image from "./images/gurpreetkaur.jpg";
import "./App.css";


/**UserFetchData fetches the data from the server */
function UseFetchData(url) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => setError(error));
  }, [url]);

  return { data, error };
}
/**DataList is the resuable rendering component */
function DataList({ data, render }) {

  return (
    <div>
      {data.map((item, index) => render(item, index))}
    </div>
  );
}
/**Overview renders the overview information */
function OverView() {
  const { data: overviewData } = UseFetchData("http://localhost:8000/getOverview");

  return (
    <DataList 
      data={overviewData} 
      render={(item, index) => (
        <div key={index}>
          <p className='nameText'>{item.firstName} {item.lastName}</p>
          <p className='textBold'>{item.title}</p>
          <p>{item.summary}</p>
        </div>
      )}
    />
  );
}
/**Skills renders the skills information */
function Skills(){
  const {data: skillsData} = UseFetchData("http://localhost:8000/getSkill");

  return (
    <DataList 
      data={skillsData} 
      render={(item, index) => (
        <ul key={index}>
          <li>{item.skill} </li>
        </ul>
      )}
    />
  );
}
/**Education renders the education information*/
function Education(){
  const {data : educationData} = UseFetchData("http://localhost:8000/getEdu")

  return (
    <DataList 
      data={educationData} 
      render={(item, index) => (
        <div key={index}>
          <div>
            <div className='textBold'>{item.instituationName}</div>
            {item.diploma}<br/>
            {item.address}<br/>
            {item.year}<br/>
            {item.additional} <br/>
          </div><br/>
        </div>
      )}
    />
  );
}
/**WorkHistory renders the work history information */
function WorkHistory(){
  const {data: workHistoryData} = UseFetchData("http://localhost:8000/getExp")

  return (
    <DataList 
      data={workHistoryData} 
      render={(item, index) => (
        <div key={index}>
          <div>
            <div className='textBold'>
              {item.role}<br/>
              {item.company}{", "}
              {item.location} { ", "}
              {item.year}
            </div>
            <br/>
            <div>
              Responsibilities:
              {item.responsibility.map((item, index) =>
                <p key={index}>{item}</p>            
              )}
            </div><br/>
          </div>
        </div>
      )}
    />
  );

}
/**Using the Carousel, Container, Row and Col achieving the rendering of the data */
function App() {
  return (
    <Container>
      <Row>
        <Col className='sideCol'></Col>
        <Col className="col-7">
          <Carousel>
            <Carousel.Item>
              <div >
                <img
                  style={{ width: 300, height: 1000, opacity: 0.2}}
                  className="d-block w-100"
                  src={
                    image
                  }
                  alt="First slide"
                />
                <Carousel.Caption>
                  <div  style={{opacity: 1, color: "black"}}> 
                    <h3 className='textHeading' >Welcome to my web resume!</h3>
                    <div className='dataText'>
                      <OverView/>
                    </div>
                  </div> 
                </Carousel.Caption>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div >
                <img
                    style={{ width: 300, height: 1000, opacity: 0.2}}
                    className="d-block w-100"
                    src={
                      "https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
                    }
                    alt="Second slide"
                />
                <Carousel.Caption>
                  <div  style={{opacity: 1, color: "black"}}> 
                    <h3 className='textHeading'>Skills</h3>
                    <div className='dataText'>
                      <Skills/>
                    </div>
                  </div> 
                </Carousel.Caption>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div >
                <img
                    style={{ width: 300, height: 1000, opacity: 0.2}}
                    className="d-block w-100"
                    src={
                      "https://images.pexels.com/photos/2767814/pexels-photo-2767814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    }
                    alt="Third slide"
                />
                <Carousel.Caption>
                  <div  style={{opacity: 1, color: "black"}}> 
                    <h3 className='textHeading' >Education</h3>
                    <div className='dataText'>
                      <Education/>
                    </div>
                  </div> 
                </Carousel.Caption>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div >
                <img
                    style={{ width: 300, height: 1225, opacity: 0.2}}
                    className="d-block w-100"
                    src={
                      "https://images.unsplash.com/photo-1600885081402-1e61a7807f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
                    }
                    alt="Fourth slide"
                />
                <Carousel.Caption>
                  <div  style={{opacity: 1, color: "black"}}> 
                    <h3 className='textHeading'>Work Experience</h3>
                    <div className='dataText'>
                      <WorkHistory/>
                    </div>
                  </div> 
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col className='sideCol'></Col>
      </Row>  
    </Container>
  );
}

export default App;
