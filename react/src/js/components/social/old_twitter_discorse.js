import React from 'react';
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle, Form, Input,
    Modal, ModalBody, ModalFooter,
    ModalHeader
} from "reactstrap";

import {Timeline} from 'react-twitter-widgets';
import twitter_icon from "../../../images/twitter.png";
import discourse_icon from "../images/discourse.png"

export class SocialUiView extends React.PureComponent {

    constructor(props) {
        super(props);

        this.toggleallyours = this.toggleallyours.bind(this);
        this.postToTwitter = this.postToTwitter.bind(this);
        this.postToDiscourse = this.postToDiscourse.bind(this);
        this.setSocial = this.setSocial.bind(this);
        this.getCurrentNewPosts = this.getCurrentNewPosts.bind(this);
        this.changeDiscourseType = this.changeDiscourseType.bind(this);
        this.onChangeField = this.onChangeField.bind(this);
        this.goToPost = this.goToPost.bind(this);
        this.toggleDiscourseModal = this.toggleDiscourseModal.bind(this);
        this.handleOnChangeText = this.handleOnChangeText.bind(this);
        this.handleOnDiscourseChangeText = this.handleOnDiscourseChangeText.bind(this);

        this.toggleTwitterModal = this.toggleTwitterModal.bind(this);
        this.selectTwitter = this.selectTwitter.bind(this);

        this.state = {
            social_selected: "twitter",
            posts: [],
            user_posts: [],
            user_discourse_posts: [],
            discourse_message: "",
            discourse_type: "all",
            open_twitter_modal: false,
            twitter_message: "Test Message",
            allyoursOpen: false,
            open_discourse_modal: false,
            discourse_key: '',
        };
    };

    goToPost(url, e) {
        window.location.href = url
    };

    componentDidMount() {
        this.getUserDiscourseKey();
    };

    handleOnChangeText(e) {
        this.setState({twitter_message: e.target.value});
    };

    handleOnDiscourseChangeText(e) {
        this.setState({discourse_message: e.target.value});
    };

    selectTwitter() {
        this.setSocial("twitter");
    };

    toggleTwitterModal() {

        this.setState({open_twitter_modal: !this.state.open_twitter_modal});
    };

    toggleDiscourseModal() {
        this.setState({open_discourse_modal: !this.state.open_discourse_modal});
    };

    setSocial(social) {
        this.setState({"social_selected": social});
        if (social === "discourse") {
            this.getCurrentNewPosts()
        }
    };

    onChangeField(e) {
        this.setState({"discourse_message": e.target.value});
    };

    changeDiscourseType(type) {
        this.setState({"discourse_type": type});
    };

    getUserDiscourseKey() {
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_forum_key_by_uuid/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token')
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                let results = responseJson["results"];
                this.setState({discourse_key: results["discourse_key"]});
                this.setState({api_username: results["api_username"]})
            })
            .catch(error => {
                console.error(error);
            })
    };

    getRepliesOnPost(id, post, user_avatar) {
        //console.log("getRepliesOnPost");
        let user_posts = this.state.user_posts;
        let url = "https://forum.openag.media.mit.edu/t/" + id + ".json?"; // eslint-disable-line no-useless-concat
        let discourse_topic_url = url + "api_key="+"ea8d111b9cfc88eca262abc8c733c10ffae100a905b094d1658b26d4f57d30d7"+"&api_username="+"manvithaponnapati"; // eslint-disable-line no-useless-concat
        //console.log(discourse_topic_url);
        return fetch(discourse_topic_url, {
            method: 'GET'
        }).then(response => response.json())
            .then(responseJson => {
                let post_count = 0
                //console.log(responseJson);
                post_count = responseJson["posts_count"];
                if (true) {
                    user_posts.push({
                        "avatar": "https://discourse-cdn-sjc1.com/business6" + user_avatar.replace("{size}", "100"),
                        "username": post["last_poster_username"],
                        "message": post["title"],
                        "yours": true,
                        "post_url": "https://forum.openag.media.mit.edu/t/" + post["id"],
                        "post_count": post_count
                    });
                    this.setState({"user_posts": user_posts});
                }
            })
            .catch(error => {
                console.error(error);
            })

    };

    getCurrentNewPosts() {
        let discourse_topic_url = "https://forum.openag.media.mit.edu/latest.json?api_key=5cdae222422803379b630fa3a8a1b5e216aa6db5b6c0126dc0abce00fdc98394&api_username=openag&category=20"
        return fetch(discourse_topic_url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(responseJson => {
                let posts = [];
                this.setState({"user_posts": []});
                //console.log(responseJson, "FG");
                let post_stream = responseJson["topic_list"]["topics"];
                let users = responseJson["users"];
                for (let post of post_stream) {
                    var div = document.createElement("div");
                    div.innerHTML = post["cooked"];
                    let user_last = post["last_poster_username"];
                    let user_avatar = "http://via.placeholder.com/100x100";
                    for (let user of users) {
                        if (user["username"] === user_last) {
                            user_avatar = user["avatar_template"]
                        }
                        //if (user["username"] === this.state.api_username) {
                            //console.log("xxxxx",post)
                        //}

                    }
                    this.getRepliesOnPost(post["id"], post, user_avatar);

                    posts.push({
                        "avatar": "https://discourse-cdn-sjc1.com/business6" + user_avatar.replace("{size}", "100"),
                        "username": post["last_poster_username"],
                        "message": post["title"],
                        "yours": false,
                        "post_url": "https://forum.openag.media.mit.edu/t/" + post["id"]
                    });
                }
                this.setState({"posts": posts});
            })
            .catch(error => {
                console.error(error);
            })
    };

    postToDiscourse() {
        var message = this.state.discourse_message;
        var title = message.substring(0, 100);

        return fetch("https://forum.openag.media.mit.edu/posts.json?api_key=bfc9267c5b620b4b68e42f763fe092ad4194a48f1e2b36b38d159028f0b70383&api_username=manvithaponnapati&raw=" + message + "&title=" + title + "&category=20", {
            method: 'POST',
            headers: {}

        })
            .then((response) => {console.log(response);response.json()})
            .then((responseJson) => {
                //alert("FDSGFDG");
                console.log(responseJson, "postToDiscourse");
                this.getCurrentNewPosts();

            })
            .catch((error) => {
                console.error(error);
            });
    };

    postToTwitter() {

        return fetch(process.env.REACT_APP_FLASK_URL + '/api/posttwitter/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token'),
                'message': this.state.twitter_message,
                'image_url':this.state.device_images[0]
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                /*console.log(responseJson, "postToTwitter")*/
                this.setState({open_twitter_modal: false})
            })
            .catch((error) => {
                console.error(error);
            });
    };

    toggleallyours() {
        this.setState({allyoursOpen: !this.state.allyoursOpen})
    };

    render() {
        let discourse_messages = this.state.posts.map((post) => {
            return (
                <div className="row" onClick={this.goToPost.bind(this, post["post_url"])}>
                    <div className="col-md-2">
                        <img src={post["avatar"]} width="30" height="30" alt=''/>
                    </div>
                    <div className="col-md-10">
                        <div className="row"><b>{post["username"]}</b></div>
                        <div className="row">{post["message"]}</div>
                    </div>
                </div>
            )
        });

        let user_discourse_messages = this.state.user_posts.map((post) => {
            return (
                <div className="row" onClick={this.goToPost.bind(this, post["post_url"])}>
                    <div className="col-md-2">
                        <img src={post["avatar"]} width="30" height="30" alt=''/>
                    </div>
                    <div className="col-md-10">
                        <div className="row"><b>{post["username"]}</b></div>
                        <div className="row">{post["message"]}</div>
                        <div className="row"><b> Replies: </b> {post["post_count"]} </div>
                    </div>
                </div>
            )
        });

        let halfbox = {width: '50%'};
        return (
            <div className="twitter">
                <div className="row buttons-row">
                    <ButtonGroup>
                        <Button
                            outline
                            onClick={() => this.setSocial('twitter')}
                            active={this.state.social_selected === 'twitter'}
                            color="primary" style={halfbox}
                        >
                            <img src={twitter_icon} height="30" alt=''/>Twitter
                        </Button>
                        <Button
                            outline
                            onClick={() => this.setSocial('discourse')}
                            active={this.state.social_selected === 'discourse'}
                            color="primary" style={halfbox} className="btn" title='Coming Soon'
                        >
                            <img src={discourse_icon} height="30" alt=''/>Discourse
                        </Button>
                    </ButtonGroup>
                </div>


                {this.state.social_selected === "twitter" ? <div className="row bottom-row">
                    <div className="col-md-12"><Button className="btn btn-block social-buttons"
                                                       onClick={this.toggleTwitterModal}>
                        Post To Twitter </Button></div>
                </div> : <div className="row bottom-row">
                    <div className="col-md-4"><Dropdown isOpen={this.state.allyoursOpen}
                                                        toggle={this.toggleallyours}>
                        <DropdownToggle caret className="toggle-caret-upper">
                            {this.state.discourse_type}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                onClick={this.changeDiscourseType.bind(this, "all")}>All</DropdownItem>
                            <DropdownItem
                                onClick={this.changeDiscourseType.bind(this, "yours")}>Yours</DropdownItem>
                        </DropdownMenu>
                    </Dropdown></div>
                    <div className="col-md-8 padding-0"><Button className="btn btn-block social-buttons"
                                                                onClick={this.toggleDiscourseModal}> Post
                        to Forum </Button></div>
                </div>}

                {this.state.social_selected === "twitter" ? <div className="row twitter-row">
                    <Timeline
                        dataSource={{
                            sourceType: 'profile',
                            screenName: 'food_computer'
                        }}
                        options={{
                            username: 'FoodComputer'
                        }}
                        onLoad={() => console.log('Timeline is loaded!')}
                    /></div> : <div className="discourse-container">

                    {this.state.discourse_type === "all" ? discourse_messages : user_discourse_messages}
                </div>}

            </div>
        )
    }
}

/*  Modals that still have to be dealt with

                    <Modal
                        isOpen={this.state.open_twitter_modal}
                        toggle={this.toggleTwitterModal}
                    >
                        <ModalHeader toggle={this.toggle}>
                            Post to twitter
                        </ModalHeader>
                        <Form onSubmit={this.onSubmit}>
                            <ModalBody>
                                <Input type="textarea" placeholder="Enter your tweet"
                                       onChange={this.handleOnChangeText}></Input>
                                <img alt=''
                                    src={this.state.device_images[0]}
                                    height="200" className="twitter-share-img"/>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" type="submit" onClick={this.postToTwitter}>
                                    Post to twitter
                                </Button>
                                <Button color="secondary" onClick={this.toggleTwitterModal}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>
                    </Modal>
                    <Modal
                        isOpen={this.state.open_discourse_modal}
                        toggle={this.toggleDiscourseModal}
                    >
                        <ModalHeader toggle={this.toggleDiscourseModal}>
                            Post to Forum
                        </ModalHeader>
                        <Form onSubmit={this.postToDiscourse}>
                            <ModalBody>
                                <Input type="textarea" placeholder="Enter your post"
                                       onChange={this.handleOnDiscourseChangeText}></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" type="submit" onClick={this.postToDiscourse}>
                                    Post to Forum
                                </Button>
                                <Button color="secondary" onClick={this.toggleDiscourseModal}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Form>
                    </Modal>

 */