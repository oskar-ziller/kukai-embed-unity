import { KukaiEmbed, TypeOfLogin } from 'kukai-embed';
import { useEffect, useRef, useState } from 'react';
import './App.css';

const REDIRECT_DEEPLINK = 'unitydl://'

const LOGIN_CONFIG = {
  loginOptions: [TypeOfLogin.Google, TypeOfLogin.Facebook, TypeOfLogin.Twitter],
  wideButtons: [true, true, true]
}

function App() {
  const [error, setError] = useState('')
  const kukaiEmbed = useRef(new KukaiEmbed({ net: "https://ghostnet.kukai.app", icon: false }))
  // test
  useEffect(() => {
    kukaiEmbed.current
      .init()
      .then(() => {
        kukaiEmbed.current
          .login(LOGIN_CONFIG)
          .then(({ pk, pkh, userData }) => {
            const { typeOfLogin } = userData
            window.location.href = `${REDIRECT_DEEPLINK}kukai-embed/?address=${pkh}&pk=${pk}&typeOfLogin=${typeOfLogin}`
          })
          .catch((error) => {
            setError(error?.message)
          })
      })
      .catch((error) => {
        setError(error?.message)
      })

    const kukaiEmbedInstance = kukaiEmbed.current

    return () => {
      kukaiEmbedInstance.logout()
    }

  }, [])

  return (
    <div className="parent">
      <div>KUKAI EMBED DELEGATE</div>
      <div>WAITING FOR ACTION</div>
      {error && <div className='error'>Status: {error}</div>}
    </div>
  );
}

export default App;
