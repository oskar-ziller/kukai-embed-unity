import { KukaiEmbed, LoginConfig, TypeOfLogin } from 'kukai-embed';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { isBrowserOAuthCompatible } from './utils';

enum ACTION_TYPES {
  OPERATION = 'operation',
  LOGIN = 'login',
}

const REDIRECT_DEEPLINK = 'unitydl://'

const DEFAULT_LOGIN_LAYOUT = {
  loginOptions: [TypeOfLogin.Google, 'email' as TypeOfLogin, TypeOfLogin.Twitter],
  wideButtons: [true, true, true]
}

function getLoginLayout() {
  const params = new URLSearchParams(decodeURIComponent(window.location.search))

  const typeOfLogin = params.get('typeOfLogin')
  const id = params.get('id') || 'sample-id'
  const nonce = params.get('nonce')

  const loginLayout = typeOfLogin ? { loginOptions: [typeOfLogin], wideButtons: [true] } as LoginConfig : DEFAULT_LOGIN_LAYOUT

  return !!nonce ? { authParams: { id, nonce }, ...loginLayout } : loginLayout
}

function getAction() {
  const params = new URLSearchParams(decodeURIComponent(window.location.search))
  const hasOperation = params.has(ACTION_TYPES.OPERATION)
  const typeOfLogin = params.get('typeOfLogin')

  if (hasOperation) {
    const operationPayload = params.get(ACTION_TYPES.OPERATION)!
    return { action: ACTION_TYPES.OPERATION, payload: JSON.parse(operationPayload), typeOfLogin }
  }

  return { action: ACTION_TYPES.LOGIN, typeOfLogin }
}

async function handleLogin(kukaiEmbed: KukaiEmbed) {
  if (kukaiEmbed.user) {
    await kukaiEmbed.logout()
  }

  const loginLayout = getLoginLayout()

  const { pkh, userData, authResponse } = await kukaiEmbed.login(loginLayout) // where pkh: tezos address 
  const { name, email } = userData as any
  const { message, signature } = authResponse || {}

  window.location.href = encodeURI(`${REDIRECT_DEEPLINK}kukai-embed/?address=${pkh}&name=${name}&email=${email}&authResponse=${authResponse}&message=${message}&signature=${signature}&typeOfLogin=${userData.typeOfLogin}`)
}


async function handleOperation(kukaiEmbed: KukaiEmbed, payload: any) {
  let pkh: string, userData: any

  if (!kukaiEmbed.user) {
    const loginLayout = getLoginLayout()
    const user = await kukaiEmbed.login(loginLayout)
    pkh = user.pkh
    userData = user.userData

  } else {
    pkh = kukaiEmbed.user.pkh
    userData = kukaiEmbed.user.userData
  }

  const operationHash = await kukaiEmbed.send(payload)
  const { name, email, typeOfLogin } = userData

  window.location.href = encodeURI(`${REDIRECT_DEEPLINK}kukai-embed/?address=${pkh}&name=${name}&email=${email}&typeOfLogin=${typeOfLogin}&operationHash=${operationHash}`)
}

function App() {
  const [error, setError] = useState('')
  const kukaiEmbed = useRef(new KukaiEmbed({ net: "https://ghostnet.kukai.app", icon: false }))

  async function handleAction() {
    if (!isBrowserOAuthCompatible()) {
      throw new Error('Please continue in an external browser')
    }

    const { action, payload } = getAction()
    await kukaiEmbed.current.init()

    try {
      action === ACTION_TYPES.LOGIN
        ? await handleLogin(kukaiEmbed.current)
        : await handleOperation(kukaiEmbed.current, payload)
    } catch (error: any) {
      setError(error?.message)
    }
  }

  useEffect(() => {

    handleAction()
      .then()
      .catch((error) => {
        setError(error?.message)
      })
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
