/**
 * Created by wenzelmk on 5/16/17.
 */

import React, { Component } from 'react';
import { Container, Header, Body, Title, Content, Form, Item, Input, Label, Button, Icon, Card, CardItem, Text } from 'native-base';
import { goBack, NavigationOptions, NavigationActions } from 'react-navigation';
import Meteor, { createContainer } from 'react-native-meteor';
import { Alert } from 'react-native';
import moment from 'moment';

import styles from '../config/styles';
//import weatherCall from '../api/weatherCall.js'


const backAction = NavigationActions.back({
    key: null
    });

class SampleAdd extends Component {
    //lines establish whether or not the modal window is visible, and write a function to make the modal visible (this is called later on lines 172 & 205
    constructor(props) {
        super(props);
        //set the initial region data for the map
        this.state = {
            region: {
                latitude: null,
                longitude: null,
            },
            title: '',
            lat: '',
            lng: '',
            date: '',
            description: '',
            owner: '',
        };

    };

    handleSubmitSamplePress = () => {


        if (this.state.title.length === 0 || this.state.description.length === 0) {
            return (
                Alert.alert(
                    'There is a problem!',
                    'It looks like you are missing some info. Please make sure you have filled all fields!',
                    [
                        {text: 'Okay!', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                )
            );
        }

        const newSample = {
            title: this.state.title,
            lat: this.state.latitude,
            lng: this.state.longitude,
            date: new Date(),
            description: this.state.description,
            owner: this.props.user._id,
        };

        Meteor.call('Samples.addOne', newSample, (err, res) => {

            if (err) {
                console.log("Sample Addition Failed")
                return (
                    Alert.alert(
                        'Your sample was not added.',
                        err.reason,
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: false }
                    )
                )
            } else {
                    this.props.navigation.dispatch(backAction);
            }
        });
    };

    /*weatherGet() {
        weatherCall(this.state.lat, this.state.lng).then((response) => {
            let weatherList = response.list[0]

            // Store nextColor, since we'd like to start next time with it.
            var current = this.state.nextColor;

            // Reset animation
            this.state.val.setValue(0);

            this.setState({
                temperature: weatherList.main.temp,
                city: weatherList.name,
                country: weatherList.sys.country,
                weatherType: weatherList.weather[0].main,
                currentColor: current,
                nextColor: this._randomColor(),
                icon: weatherIcon(weatherList.weather[0].icon)
            });

        });
    };*/

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState(
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                );

            },

        );
    }


    render() {
        return (
            <Container>
                <Header style = {styles.header}>
                    <Button transparent light
                            onPress={() => this.props.navigation.dispatch(backAction)}
                            title='Go back to Map Page'>
                        <Icon name='arrow-back' />
                    </Button>
                    <Body>
                        <Title style = {styles.headerTitle}>Add Sample</Title>
                    </Body>
                </Header>
                <Content
                    style = {styles.contentStyle}>
                    <Card>
                        <Form>
                            <Item floatingLabel>
                                <Label>Sample Name</Label>
                                <Input
                                    onChangeText={(text) => {this.setState({title: text})}}
                                />
                            </Item>
                            <Item disabled stackedLabel>
                                <Label>Date and Time</Label>
                                <Input disabled placeholder={moment(new Date()).format("MMM Do YYYY, h:mm a")}/>
                            </Item>
                            <Item disabled stackedLabel>
                                <Label>Latitude</Label>
                                <Input disabled placeholder={String(this.state.latitude)} value={String(this.state.latitude)}/>
                            </Item>
                            <Item disabled stackedLabel>
                                <Label>Longitude</Label>
                                <Input disabled placeholder={String(this.state.longitude)} value={String(this.state.longitude)}/>
                            </Item>
                            <Item floatingLabel>
                                <Label>Details</Label>
                                <Input
                                    onChangeText={(text) => {this.setState({description: text})}}
                                />
                            </Item>
                        </Form>
                        <CardItem></CardItem>
                    </Card>
            </Content>
            <Button block style={styles.buttonBlock}
                    onPress = {() => {
                        this.handleSubmitSamplePress()
                    }}>
                <Text>Submit Sample</Text>
                <Icon name='checkmark' />
            </Button>
            </Container>

        );
    }
};

export default createContainer(() => {

    return {
        user: Meteor.user(),
    };
}, SampleAdd);
