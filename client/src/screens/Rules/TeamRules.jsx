import React, { Component } from "react";
import {
  Grid,
  Divider,
  Dimmer,
  Segment,
  Header,
  Input,
  Button,
  Loader
} from "semantic-ui-react";
import LandingPage from "./../LandingPage/LandingPage.jsx";
import Rules from "../../components/Rules";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/loader.css";

export default class TeamRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamRules: {},
      newRule1: "",
      openModal: false,
      loading: true,
      loaderContent: "Loading...",
      newRule: {
        name: "",
        metric: "",
        threshold: 0 ,
        mName: "",
        operator: "",
        reward: 0
      }
    };
  }

  //handleChange = event => {
    //this.setState({
      //[event.target.id]: event.target.value
    //});
  //}

  componentDidMount() {
    this.dataFetching();
  }

  dataFetching = () => {
    axios
      .get("http://ec2-52-66-245-186.ap-south-1.compute.amazonaws.com:8080/TW_Backend_Rule/rule/")
      .then(response => {
        let { data } = response;
        let ds = typeof data === "string" ? JSON.parse(data) : data;
        this.setState({
          loading: false,
          teamRules: ds
        });
      })
      .catch(error => {
        return error;
      });
  };

  // add a rule
  addRule() {
    let { newRule } = this.state;
    this.setState({
      openModal: false,
      loaderContent: "Applying rule",
      loading: true
    });
    //console.log("rule",newRule);
    axios
      .post("http://localhost:9003/rules/", 
        newRule
      )
      .then(response => {
        console.log("my response",response.data);
        if (response.data === "Sorry same name exists") {
          this.setState({
            loading: false,
            loaderContent: "Loading..."
          });
          this.failureAlert("Rule already exists");
          this.dataFetching();
        }
        else {
        this.setState({
          loading: false,
          loaderContent: "Loading..."
        });
        this.successAlert("Rule applied successfully");
        this.dataFetching();
      }
      })
      .catch(error => {
        this.failureAlert("Rule application failed");
        return error;
      });
  }

  resetData = () => {
    axios
      .get("/api/dashboard/reset/team")
      .then(response => {
        if (response.data === "Reset success") {
          axios
            .get("/api/calculate")
            .then(response => {
              if (response.data === "Calculation success") {
                this.setState({
                  loading: false,
                  loaderContent: "Loading..."
                });
                this.successAlert("Data reset success");
                this.dataFetching();
              }
            })
            .catch(error => {
              this.failureAlert("Data reset failed");
              return error;
            });
        }
      })
      .catch(error => {
        this.failureAlert("Data reset failed");
        return error;
      });
  };

  successAlert(message) {
    toast.success(message);
  }

  failureAlert(message) {
    toast.warn(message);
  }

  render() {
    let { teamRules, newRule } = this.state;
    return (
      <LandingPage activeName="teamRules">
        <Grid>
          <Grid.Row>
            <Grid.Column width={8} style={{ float: "left" }}>
              <h4>TEAM RULES</h4>
            </Grid.Column>
            <Grid.Column
              width={8}
              style={{ float: "left", position: "absolute", right: "-31%" }}
            >
              <Button
                primary
                onClick={() => {
                  this.setState({
                    openModal: true
                  });
                }}
              >
                Add Rule
              </Button>
              <Button primary onClick={this.resetData}>
                Reset
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row style={{ height: "85vh" }}>
            <Rules data={teamRules} />
          </Grid.Row>
        </Grid>
        <Dimmer active={this.state.openModal}>
          <Segment
            style={{
              color: "black",
              width: "50%",
              height: "78%",
              float: "right",
              marginTop: "5%",
              marginRight: "20%"
            }}
          >
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Header
                    icon="write"
                    content="Add Rule"
                    style={{ marginLeft: "35%", marginTop: "0%" }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Rule name:</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input placeholder="Rule name" defaultValue={newRule.name}  
                  onChange={e => {
                    let copy = {...this.state.newRule}
                    copy.name = e.target.value
                     this.setState({
                      newRule:copy
                    }); 
                   }}  />
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Rule Description</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input
                    placeholder="Rule Description"
                    defaultValue={newRule.metric}
                    onChange={e => {
                      let copy = {...this.state.newRule}
                      copy.metric = e.target.value
                       this.setState({
                        newRule:copy
                      }); 
                     }}  />
                  
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Metric name:</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input placeholder="Metric name" defaultValue={newRule.mName}  
                  onChange={e => {
                    let copy = {...this.state.newRule}
                    copy.mName = e.target.value
                     this.setState({
                      newRule:copy
                    }); 
                   }}  />
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Operator</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input placeholder="Operator" defaultValue={newRule.operator}  
                  onChange={e => {
                    let copy = {...this.state.newRule}
                    copy.operator = e.target.value
                     this.setState({
                      newRule:copy
                    }); 
                   }}  />
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Threshold</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input placeholder="Threshold" defaultValue={newRule.threshold}  
                  onChange={e => {
                    let copy = {...this.state.newRule}
                    copy.threshold = e.target.value
                     this.setState({
                      newRule:copy
                    }); 
                   }}  />
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Reward</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input placeholder="Reward" defaultValue={newRule.reward}  
                  onChange={e => {
                    let copy = {...this.state.newRule}
                    copy.reward = e.target.value
                     this.setState({
                      newRule:copy
                    }); 
                   }}  />
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Button primary onClick={this.addRule.bind(this)}>
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      this.setState({
                        openModal: false
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Dimmer>
        <Dimmer active={this.state.loading} inverted>
          {this.state.loaderContent === "Applying rule" ? (
            <div className="loader">
              <ul className="ulClass">
                <li className="liClass" />
                <li className="liClass" />
                <li className="liClass" />
                <li className="liClass" />
              </ul>
              <p id="textContent">
                Applying the rule.
                <br /> Please wait for some time.
              </p>
              <br />
            </div>
          ) : (
            <Loader style={{ marginLeft: "8%" }}>Loading.....</Loader>
          )}
        </Dimmer>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </LandingPage>
    );
  }
}
