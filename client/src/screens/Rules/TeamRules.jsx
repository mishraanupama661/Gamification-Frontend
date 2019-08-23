import React, { Component } from "react";
import {
  Grid,
  Divider,
  Dimmer,
  Segment,
  Header,
  Input,
  Button,
  Dropdown,
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
      openModal: false,
      loading: true,
      loaderContent: "Loading...",
      toolNames:[
        { name: 'SCM',  metrics: ['commitCount']},
        { name: 'Code Quality', metrics: ['blockerViolations', 'codeCoverage', 'criticalViolations']},
      ],
      selectedTool: 'SCM',
      newRule: {
        name: "",
        toolName: "scm:Scm",
        mName: "commitCount",
        threshold: 0 ,
        operator: ">", 
        reward: 0
      }
    };
  }

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

  handleChange = (e) => {
    //console.log(this.state)
    this.setState({selectedTool: e.target.value})
    //this.state.newRule.toolName = e.target.value
    if(e.target.value === "Code Quality")
    {
      this.state.newRule.toolName="sonar:Sonar"
    }
    else
    {
      this.state.newRule.toolName="scm:Scm"
    }
  }

  resetRule() {
    let copy = {...this.state.newRule}
      copy.name= ""
      copy.toolName= "scm:Scm",
      copy.mName= "commitCount",
      copy.threshold= 0 ,
      copy.operator= ">", 
      copy.reward= 0
      this.setState({
        newRule:copy
      });
    
    //console.log("Resetting",this.state.newRule)
  }

  // add a rule
  addRule() {
    let { newRule } = this.state;
    this.setState({
      openModal: false,
      loaderContent: "Applying rule",
      loading: true
    });
    console.log("rule",newRule);
    axios
      .post("http://ec2-52-66-245-186.ap-south-1.compute.amazonaws.com:8080/TW_Backend_Rule/rule/", 
        newRule
      )
      .then(response => {
        //console.log("my response",response.data);
        if (response.data === "Sorry same name exists") {
          this.setState({
            loading: false,
            loaderContent: "Loading..."
          });
          this.failureAlert("Rule already exists");
          this.dataFetching();
          this.resetRule();
        }
        else {
        this.setState({
          loading: false,
          loaderContent: "Loading..."
        });
        this.successAlert("Rule applied successfully");
        this.dataFetching();
        this.resetRule();
      }
      })
      .catch(error => {
        this.failureAlert("Rule application failed");
        return error;
      });
  }
 
  resetData = () => {
    axios
      .get("http://localhost:5058/rule/")
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

  //handleChange = (e, { value }) => this.setState({ value })

  render() {
    let tool = this.state.toolNames.filter(tool => {
      return tool.name === this.state.selectedTool
    })
    const { value } = this.state;
    let { teamRules } = this.state;
    //console.log("Metric",{metric})
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
                  <p style={{ textAlign: "left" }}>Rule Name</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input placeholder="Rule Name" value={this.state.newRule.name}  
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
                  <p style={{ textAlign: "left" }}>Tool name:</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <select value={this.state.selectedTool} onChange={this.handleChange.bind(this)}>
                  {
                  this.state.toolNames.map((tool, i) => {
                  return <option>{tool.name}</option>
                  })
                  }
                 </select>
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Metric</p>
                </Grid.Column>
                <Grid.Column width={6}>
                <select defaultValue={this.state.newRule.mName}
                 onChange={e => {
                  let copy = {...this.state.newRule}
                  copy.mName=e.target.value
                   this.setState({
                    newRule:copy
                  }); 
                 }}>
                  {
                  tool[0].metrics.map((metric, i) => {
                  return <option>{metric}</option>
                  })
                  }
                </select>  
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Operator</p>
                </Grid.Column>
                <Grid.Column width={6}>
                <select 
                 value={this.state.newRule.operator} 
                 onChange={e => {
                  let copy = {...this.state.newRule}
                  copy.operator=e.target.value
                   this.setState({
                    newRule:copy
                  }); 
                 }} 
                >
                <option value=">">greater than</option>
                <option value="<=">less than or equal to</option>
                </select>           
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4} />
                <Grid.Column width={4}>
                  <p style={{ textAlign: "left" }}>Threshold</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Input placeholder="Threshold" value={this.state.newRule.threshold}  
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
                  <Input placeholder="Reward" value={this.state.newRule.reward}  
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
