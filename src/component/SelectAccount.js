import React, {Component} from 'react'
import {Modal, Select} from "antd";
import Axios from "../server";
// import Pullup from "pullup-js-sdk";
import popup from 'popup-js-sdk'

let tmpPkr = '';
let ajax = new Axios();
const {Option} = Select;

// var pullup = new Pullup();
// pullup.setProvider(new pullup.providers.HttpProvider('http://127.0.0.1:2345'));

class SelectAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountOptions: [],
            accounts: [],
        }
    }


    componentDidMount() {
        this.getAccounts();
    }

    handleOk = e => {
        let that = this;
        if (tmpPkr !== '') {
            let accounts = that.state.accounts;
            for (let ac of accounts) {
                if (ac.MainPKr === tmpPkr) {
                    that.props.selectAccount(ac);
                }
            }
        }
        that.props.hiddenAccount();
    };

    handleCancel = e => {
        let that = this;
        that.props.hiddenAccount();
    };

    onChange = (v) => {
        tmpPkr = v;
    }

    formatPK(pk) {
        return pk.slice(0, 10) + "...." + pk.slice(-10)
    }

    getAccounts() {
        let that = this;
        // let res = pullup.local.accountList()
        popup.accountList(function (res) {
            if (res) {
                let dataArray = res;
                let i = 0;
                let tmpArr = [];
                for (let ac of dataArray) {
                    let acName = ac.Name;
                    i++;
                    if (!acName) {
                        acName = "Account" + i;
                    }
                    tmpArr.push(<Option value={ac.MainPKr} key={i}>{acName + " " + that.formatPK(ac.PK)}</Option>)
                }
                that.setState({
                    accountOptions: tmpArr,
                    accounts: dataArray
                })
            }
        });
    };

    render() {
        return (
            <Modal
                title="Select Account"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Select showSearch
                        style={{width: '98%'}}
                        placeholder="Select an account"
                        onChange={(v) => {
                            this.onChange(v);
                        }}
                >
                    {this.state.accountOptions}
                </Select>
            </Modal>
        )
    }
}


export default SelectAccount