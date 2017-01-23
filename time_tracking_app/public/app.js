
// ---------------------------------------
//            TimersDashboard
// ---------------------------------------

const TimersDashboard = React.createClass({
    
    getInitialState:function () {
        
        return {
            timers:[{
                title:'Practice squat',
                project:'Gym Chores',
                id:uuid.v4(),
                elapsed:5456099,
                runningSince:Date.now(),
            }, {
                title:'Bake squash',
                project:'Kitchen Chores',
                id:uuid.v4(),
                elapsed:1273998,
                runningSince:null,
            }]
        };
        
    },
    
    handleCreateFormSubmit: function (timer) {
        
        this.createTimer(timer);
        
    },
    
    createTimer: function (timer) {
        
        const t = helpers.newTimer(timer);
        this.setState({ timers: this.state.timers.concat(t) });
        
    },
    
    handleEditFormSubmit: function (attrs) {
        
        this.updateTimer(attrs);
        
    },
    
    updateTimer: function (attrs) {
        
        this.setState({
           timers: this.state.timers.map(
               (timer) => {
                   if (timer.id === attrs.id) {
                       return Object.assign({}, timer, {
                           title:attrs.title,
                           project:attrs.project
                       });
                   } else {
                       return timer;
                   }
               }
           )
        });
        
    },
    
    handleTimerDelete: function (timerId) {
        
        this.deleteTimer(timerId);
        
    },
    
    deleteTimer: function (timerId) {
        
        this.setState({
            timers: this.state.timers.filter( (t) => t.id !== timerId )
        });
        
    },
    
    handleStartClick: function (timerId) {
        
        this.startTimer(timerId);
        
    },
    
    handleStopClick: function (timerId) {
    
        this.stopTimer(timerId);
        
    },
    
    startTimer: function (timerId) {
        
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map(
                (timer) => {
                    if (timer.id === timerId) {
                        return Object.assign({}, timer, { runningSince: now });
                    } else {
                        return timer;
                    }
                }
            )
        });
        
    },
    
    stopTimer: function (timerId) {
        
        const now = Date.now();
        this.setState({
            timers: this.state.timers.map(
                (timer) => {
                    if (timer.id === timerId) {
                        const lastElapsed = now - timer.runningSince;
                        return Object.assign({}, timer, {
                            elapsed: timer.elapsed + lastElapsed,
                            runningSince: null
                        });
                    } else {
                        return timer;
                    }
                }
            )
        });
        
    },
    
    render:function () {
        
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onDeleteClick={this.handleTimerDelete}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick} />
                    <ToggleableTimerForm
                        onFormSubmit={this.handleCreateFormSubmit} />
                </div>
            </div>
        );
        
    }
    
});

// ---------------------------------------
//            EditableTimerList
// ---------------------------------------

const EditableTimerList = React.createClass({
    
    render:function () {
        
        const timers = this.props.timers.map((timer) => (
            <EditableTimer
                key={timer.id}
                id={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                runningSince={timer.runningSince}
                onFormSubmit={this.props.onFormSubmit}
                onDeleteClick={this.props.onDeleteClick}
                onStartClick={this.props.onStartClick}
                onStopClick={this.props.onStopClick}
            /> 
        ));
        return (
            <div id='timers'>
                {timers}
            </div>
        );
        
    }
    
});

// ---------------------------------------
//              EditableTimer
// ---------------------------------------

const EditableTimer = React.createClass({
    
    getInitialState: function () {
        
        return { editFormOpen: false };
        
    },
    
    handleEditClick: function () {
        
        this.openForm();
        
    },
    
    handleFormSubmit: function (timer) {
        
        this.props.onFormSubmit(timer);
        this.closeForm();
        
    },
    
    handleFormClose: function () {
        
        this.closeForm();
        
    },
    
    openForm: function () {
        
        this.setState({ editFormOpen: true });
        
    },
    
    closeForm: function () {
        
        this.setState({ editFormOpen: false });
        
    },
    
    render:function () {
        
        if (this.state.editFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                    onDeleteClick={this.props.onDeleteClick}
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
                />
            );
        }
        
    }
    
});

// ---------------------------------------
//               TimerForm
// ---------------------------------------

const TimerForm = React.createClass({
    
    componentDidMount: function () {
        
        $('.ui.form').form({
            on: 'blur',
            inline: true,
            fields: {
                title: {
                    identifier: 'title',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter a title.'
                        }
                    ]
                },
                project: {
                    identifier: 'project',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter a project name.'
                        }
                    ]
                }
            }
        });
        // focus on 1st form field (title), otherwise
        // directly submitting will skip any 'blur' event.
        this.refs.title.focus();
        
    },
    
    handleSubmit: function () {
        
        const noOfErrors = $('.ui.form .field.error').length;
        if (noOfErrors === 0) {
            this.props.onFormSubmit({
                id: this.props.id,
                title: this.refs.title.value,
                project: this.refs.project.value
            });
        }
        
    },
    
    render:function () {
        
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' name='title' ref='title' defaultValue={this.props.title}/>
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' name='project' ref='project' defaultValue={this.props.project}/>
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button
                                className='ui basic blue button'
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </button>
                            <button
                                className='ui basic red button'
                                onClick={this.props.onFormClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
        
    }
    
});

// ---------------------------------------
//           ToggleableTimerForm
// ---------------------------------------

const ToggleableTimerForm = React.createClass({
    
    getInitialState: function () {
        
        return { isOpen: false };
        
    },
    
    // used by [+] button
    handleFormOpen: function () {
        
        this.setState({ isOpen: true});
        
    },
    
    // used by TimerForm
    handleFormSubmit: function (timer) {
        
        this.props.onFormSubmit(timer);
        this.setState({ isOpen: false });
        
    },
    
    // used by TimerForm
    handleFormClose: function () {
        
        this.setState({ isOpen:false });
        
    },
    
    render:function () {
        
        if (this.state.isOpen) {
            return (
                <TimerForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
                <div className='ui basic content center aligned segment'>
                    <button 
                        className='ui basic button icon'
                        onClick={this.handleFormOpen}
                    >
                        <i className='plus icon'></i>
                    </button>
                </div>
            );
        }
        
    }
    
});

// ---------------------------------------
//                  Timer
// ---------------------------------------

const Timer = React.createClass({
    
    getInitialState: function () {
        
        return { showEditDeleteButtons: false };
        
    },
    
    componentDidMount: function () {
        
        this.forceUpdateInterval = setInterval( () => this.forceUpdate(), 1000);
        
    },
    
    componentWillUnmount: function () {
        
        clearInterval(this.forceUpdateInterval);
        
    },
    
    handleStartClick: function () {
        
        this.props.onStartClick(this.props.id);
        
    },
    
    handleStopClick: function () {
        
        this.props.onStopClick(this.props.id);
        
    },
    
    handleDeleteClick: function () {
        
        this.props.onDeleteClick(this.props.id);
        
    },
    
    toggleShowHideEditDeleteButtons: function () {
        
        this.setState({ showEditDeleteButtons: !this.state.showEditDeleteButtons });
        
    },
    
    render:function () {
        
        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
        return (
            <div className='ui centered card'>
                <div className='content'
                     onMouseEnter={this.toggleShowHideEditDeleteButtons}
                     onMouseLeave={this.toggleShowHideEditDeleteButtons}>
                    <div className='extra content'>
                        <span
                            ref='editIcon'
                            className='right floated edit icon'
                            onClick={this.props.onEditClick}
                            hidden={!this.state.showEditDeleteButtons}
                        >
                            <i className='edit icon'></i>
                        </span>
                        <span
                            ref='deleteIcon'
                            className='right floated trash icon'
                            onClick={this.handleDeleteClick}
                            hidden={!this.state.showEditDeleteButtons}
                        >
                            <i className='trash icon'></i>
                        </span>
                    </div>
                    <div className='header'> {this.props.title} </div>
                    <div className='meta'> {this.props.project} </div>
                    <div className='center aligned description'>
                        <h2>{elapsedString}</h2>
                    </div>
                </div>
                <TimerStartStopButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick} />
            </div>
        );
    },
});

// ---------------------------------------
//        TIMER START STOP BUTTON
// ---------------------------------------

const TimerStartStopButton = React.createClass({
   
    render: function () {
        
        if (this.props.timerIsRunning) {
            return (
                <div className="ui bottom attached red basic button"
                     onClick={this.props.onStopClick}>Stop</div>
            );
        } else {
            return (
                <div className="ui bottom attached green basic button"
                     onClick={this.props.onStartClick}>Start</div>
            );
        }
        
    }
    
});

// ---------------------------------------
//            RENDERING THE APP
// ---------------------------------------

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);
