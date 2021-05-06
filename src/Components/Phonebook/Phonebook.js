import React, { Component } from "react";
// import { v4 as uuidv4 } from "uuid";
import PhoneFilter from "./PhoneFilter/PhoneFilter";
import PhoneForm from "./PhoneForm/PhoneForm";
import PhoneList from "./PhoneList/PhoneList";
import axios from "axios";

export default class Phonebook extends Component {
  state = {
    contacts: [],
    filter: "",
  };
  async componentDidMount() {
    try {
      const { data } = await axios.get(
        `https://phonebook-20-default-rtdb.firebaseio.com/contacts.json`
      );
      if (data) {
        const contacts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        this.setState({ contacts });
      }

      console.log(data);
    } catch (error) {}
  }

  addContact = async (contact) => {
    const someName = this.state.contacts
      .map((cont) => cont.name.toLowerCase())
      .includes(contact.name.toLowerCase());
    const someNum = this.state.contacts
      .map((cont) => cont.number)
      .includes(contact.number);
    if (someName) {
      alert(`${contact.name} is already in contacts`);
      return;
    } else if (someNum) {
      alert(`${contact.number} is already in contacts`);
      return;
    }
    try {
      const { data } = await axios.post(
        `https://phonebook-20-default-rtdb.firebaseio.com/contacts.json`,
        contact
      );
      this.setState((prevState) => {
        return {
          contacts: [...prevState.contacts, { ...contact, id: data.name }],
        };
      });
      console.log(data);
    } catch (error) {}
  };
  deleteContact = async (e) => {
    try {
      const { id } = e.target;
      await axios.delete(
        `https://phonebook-20-default-rtdb.firebaseio.com/contacts/${id}.json`
      );
      this.setState({
        contacts: this.state.contacts.filter((contact) => contact.id !== id),
      });
    } catch (error) {}
  };
  setFilter = (e) => {
    const { value } = e.target;
    this.setState({ filter: value });
  };
  getFilteredContacts = () => {
    return this.state.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(this.state.filter.toLowerCase()) ||
        contact.number.includes(this.state.filter)
    );
  };
  render() {
    return (
      <div className="relative mx-auto max-w-md px-8 py-12 bg-white border-0 shadow-lg sm:rounded-3xl ">
        <PhoneForm addContact={this.addContact} />
        <PhoneFilter filter={this.state.filter} setFilter={this.setFilter} />
        <PhoneList
          contacts={this.getFilteredContacts()}
          deleteContact={this.deleteContact}
        />
      </div>
    );
  }
}
