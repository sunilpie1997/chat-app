import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../authentication/auth-context';
import {Link} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import {useStyles} from '../../styles/style';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FriendTable from './friend-table';
import validateEmail from '../../utils/validate-email';
import { searchUser } from '../../services/friends-service';
import AlertMessage from '../../utils/alerts';
import Snackbar from '@material-ui/core/Snackbar';

const SearchFriend = () => {

    const authContext = useContext(AuthContext);
    const user = authContext.loggedInUser.user;

    const classes = useStyles();

    const [ unAuthorized, setUnAuthorised] = useState(true);
    const [friend, setFriend] = useState(null);
    const [email,setEmail] = useState('');

    /************** for alerts (success and failure) ***********/
    const [open,setOpen] = useState(false);
    const [message,setMessage] = useState('');
    const [error, setError] = useState(false);
    /************************************************************/

    useEffect(() => {

        if(user) 
        { setUnAuthorised(false); }
        else
        { setUnAuthorised(true); }

    },[user])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const handleSearch = async () => {

        // check if user has entered his email :)) validated on backend also
        if(validateEmail(email) && email !== user.email)
        {   
            // reset before request
            setFriend(null);
            
            const apiResp = await searchUser(email);            
            if(apiResp.error)
            {
                setOpen(true);
                setMessage(apiResp.message);
                setError(true);
            }
            else
            {
                setFriend(apiResp.data);
            }
        }
        else
        {
            setOpen(true);
            setMessage("please enter valid email");
            setError(true);
        }
    }

    return (

        <Box>
            {unAuthorized ? (
                <Typography variant="h5" className={classes.text}>Please Login</Typography>
            ) :(
                <React.Fragment>
                {/***************************** alerts on error and success *****************************/}    
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                        {
                            error ? (
                               <AlertMessage onClose={handleClose} severity="error">{message}</AlertMessage>
                            ):
                            (
                                <AlertMessage onClose={handleClose} severity="success">{message}</AlertMessage>
                            )
                        }
                    </Snackbar>
                    
                {/*****************************************************************************************/}   

                    <Box className={classes.info_message}>
                        <AlertMessage severity="info">Add friends here</AlertMessage>
                    </Box>
                    <Box className={classes.search_box}>
                                                
                        <TextField id="standard-basic" label="your friend" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <Fab variant="extended" color="secondary" size="small" style={{margin:'1em'}} onClick={handleSearch}>Search</Fab>
                        
                    </Box>
                    
                    {
                        friend && (
                            <Box className={classes.friend_table_box}>
                                <FriendTable user={friend}/>
                            </Box>
                        )
                    }

                    <Link to="/">
                        <Fab variant="extended" color="primary" size="small" style={{margin:'1em'}}>Back</Fab>
                    </Link>
                
                </React.Fragment>
                )
            }
        </Box>
    )
}


export default SearchFriend;