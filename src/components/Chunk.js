import React from 'react';
import { Panel, Form, Button } from 'react-bootstrap';
import Chunks from './Chunks';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';


class Chunk extends React.Component {

  constructor() {
    super();
    this.state = {
      chunk: {},
      popularity: null
    };

    this.submitChunkHandler = this.submitChunkHandler.bind(this);
    this.getChunks = this.getChunks.bind(this);
    this.upChunk = this.upChunk.bind(this);
    this.downChunk = this.downChunk.bind(this);
    this.adjustPopularity = this.adjustPopularity.bind(this);
  }

  componentWillMount(){
    this.setState({
      chunk: this.props.chunk,
      popularity: this.props.chunk.popularity
    });
  }

  getChunks(chunkId){
    fetch("/getChunks/" + chunkId,{
      method:"GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(result => result.json())
    .then(data => this.setState({chunks: data}));
  }

  submitChunkHandler(e){
    e.preventDefault();
    fetch("/newChunk",{
      method:"POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: this.state.content,
        parentchunk: this.props.chunk._id
      })
    });
  }

  adjustPopularity(chunkId, adjust){
    fetch("/adjustChunk",{
      method:"PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chunkId: chunkId,
        adjustment: adjust
      })
    })
    .then(this.setState({popularity: this.state.popularity + adjust}));
  }

  upChunk(){
    this.adjustPopularity(this.props.chunk._id, 1);
  }

  downChunk(id){
    this.adjustPopularity(this.props.chunk._id, -1);
  }

  render() {
    if(this.state.chunk){
      return (
        <Panel className="chunk" key={this.state.chunk._id}><Link  to= {{pathname: '/Story/' + this.props.treeId + "/" + this.state.chunk._id}}>
               {this.state.chunk.content}</Link>
        <br/>
        {this.state.popularity}
        <br/>
        <Button onClick={this.upChunk}>Up</Button>
        <Button onClick={this.downChunk}>Down</Button>
        </Panel>
      );
    }else{
      return (<div/>);
    }

  }
}

Chunk.propTypes = {
  chunk: React.PropTypes.object,
  treeId: React.PropTypes.string
};

export default inject("treeChunkStore")(observer(Chunk));
