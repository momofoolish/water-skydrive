import React from 'react';

export default class FileType extends React.Component {
    constructor(props){
        super(props)
        this.state={}
    }

    render() {
        return (
            <div>
                分类：{this.props.match.params.key}
            </div>
        )
    }
}

