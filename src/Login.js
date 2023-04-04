import { useRef, useState, useEffect, useContext } from "react"
import AuthContext from "./context/AuthProvider"
import axios from "./api/axios"

const LOGIN_URL = 'api/v1/auth'

const Login = () => {
    
    const { setAuth } = useContext(AuthContext)

    const userRef = useRef()
    const errRef = useRef()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

  
    useEffect(() => {

        setErrMsg('')
    
    }, [user, pwd])

    //    ------- -HANDLE SUBMIT- -------
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {

            const response = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }),
                {

                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                
                })
            
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken
            const roles = response?.data?.roles
            setAuth({ user, pwd, roles, accessToken })               
            setUser('')
            setPwd('')
            setSuccess(true)    

        } catch(err) {
        
            if (!err?.response) {

                setErrMsg(`No Server Response: ${err}`)
                console.log(err)

            } else if(err.response?.status === 400) {
                
                setErrMsg('Missing Username or Password')
                console.log(err)

            } else if (err.response?.status === 401) {
            
                setErrMsg(`Unauthorized: ${err}`)
                console.log(err)

            } else {

                setErrMsg(`Login Failed: ${err}`)
                console.log(err)

            }

        }
       
    }

    return (
        
        <>
            
            {success ? (
                <section>
                    <h1>Iniciaste Sesion!</h1>
                    <br />
                    <p>
                        <a href='#'>Ve a casa</a>
                    </p>
                </section>
            ):(
                <section>
                    <p ref={errRef}
                        className={errMsg ? 'errmsg' : 'offscreen'}
                        aria-live='assertive'>
                        {errMsg}
                    </p>
                    <h1>Iniciar Sesion</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="userName">Usuario:</label>
                        <input
                            type='text'
                            id='username'
                            ref={userRef}
                            autoComplete='off'
                            onChange={(e) => { setUser(e.target.value) }}
                            value={user}
                            required
                        />
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type={"password"}
                            id='password'
                            onChange={(e) => { setPwd(e.target.value) }}
                            value={pwd}
                            required
                        />
                            <button>Iniciar Sesion</button>
                    </form>
                    <p>
                        ¿Necesitas una cuenta? <br/>
                        <span className="line">
                                
                        <a href="#">Registrarse</a>
                        
                        </span>
                    </p>
                </section>
            )} 

        </>

    )

}

export default Login