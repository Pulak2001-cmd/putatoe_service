import React, { Component } from 'react';
import axios from 'axios';
import { Bars, BallTriangle, Audio } from  'react-loader-spinner';
import InfiniteScroll from "react-infinite-scroll-component";

export class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: true, 
            length: 0,
            num: 0,
            temp: true,
            empty: false,
            search: "",
            names: [],
        }
    }
    async componentDidMount() {
        const response = await axios.get(`https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/allpopular/${this.state.num}`);
        console.log(response.data.length);
        console.log("HEllo")
        this.setState({loading: false, list: response.data.list, length: response.data.length});
        response.data.list.map((item) =>{
            if(!this.state.names.includes(item.product_name)){
                this.state.names.push(item.product_name);
            }
        })
    }
    fetchMoreData = async () => {
        this.setState({loading: true});
        const response = await axios.get(`https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/allpopular/${this.state.num + 12}`);
        this.setState({num: this.state.num + 12, list: this.state.list.concat(response.data.list)});
        this.setState({loading: false});
        if(response.data.list.length === 0){
            this.setState({empty: true});
        }
        response.data.list.map((item) =>{
            if(!this.state.names.includes(item.product_name)){
                this.state.names.push(item.product_name);
            }
        })
    }
    handleCheck = (e)=>{
        console.log("checking");
        console.log(e.target.checked);
        this.setState({temp: e.target.checked});
    }
    handleSubmit = async(i)=>{
        console.log(i);
        const body = {
            popular_product: this.state.temp
        }
        const response = await axios.post(`https://putatoeprod-k3snqinenq-uc.a.run.app/v1/api/changePopular/${i}`, body);
        console.log(response.data.status);
        if (response.data.status === true) {
            alert("Data changed");
        }
    }
    handleSearch = (e)=>{
        this.setState({search: e.target.value});
        console.log(this.state.search)
        const filter = [];
        const back = this.state.list;
        if (e.target.value.length === 0){
            console.log(e.target.value.length);
            console.log(back);
            this.setState({list: back});
        }
        else{
            this.state.list.map((item, i)=>{
                console.log(item.product_name, this.state.search);
                if(item.product_name === e.target.value) {
                    filter.push(item);
                }
            })
            this.setState({list: filter, empty: true});
        }
    }
  render() {
    return (
        <>
        <div className="container" style={{marginLeft: "33%"}}>
        <p>Total Count: {this.state.list.length}</p>
        <div className="mb-3" style={{display: "inline-block"}}>
        <input className="form-control" list="datalistOptions1" value={this.state.search} onChange={this.handleSearch} id="exampleDataList" placeholder="Search the product Name" width="150%"/>
        <datalist id="datalistOptions1">
            {this.state.names.map((crs, i)=>{
                return <option value={crs} key={i}/>
            })}
        </datalist>
        </div>
        </div>

      <div className="my-3">
        {this.state.list.length !== 0 ?
        <InfiniteScroll dataLength={this.state.list.length} next={this.fetchMoreData} hasMore={this.state.empty === false} loader={<div style={{marginLeft: "555px" }}>	<Bars color="#00BFFF" height={80} width={80} /> </div>}>
        <table className="table">
            <thead>
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Product Name</th>
                <th scope="col">Serviceprovider Name</th>
                <th scope="col">Service</th>
                <th scope="col">Brand</th>
                <th scope="col">Product Type</th>
                <th scope="col">Image</th>
                <th scope="col">Popular product</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {this.state.list.map(item => {
                    return <tr key={item.id}>
                        <th scope="row">{item.id}</th>
                        <td>{item.product_name}</td>
                        <td>{item.serviceprovider}</td>
                        <td>{item.service_id}</td>
                        <td>{item.brand}</td>
                        <td>{item.product_type}</td>
                        <td>{item.url === ""? <img src='https://i.ibb.co/NVPQzCH/tmp-1626811631362.jpg' height="50px" width="50px"/>:
                            <img src={item.url} defaultValue={'https://i.ibb.co/NVPQzCH/tmp-1626811631362.jpg'} height="50px" width="50px"/>}</td>
                        <td>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={this.handleCheck} defaultChecked={item.popular_product} />
                            </div>
                        </td>
                        <td>{item.price}</td>
                        <td><button class="btn btn-outline-primary" onClick={()=>{this.handleSubmit(item.id)}}>Save</button></td>
                    </tr>
                })}
            </tbody>
        </table>
        </InfiniteScroll>
        : <div style={{marginLeft: "555px", marginTop: "355px"}}>	<Bars color="#00BFFF" height={80} width={80} /> </div>
        }
      </div>
      </>
    )
  }
}

export default Table