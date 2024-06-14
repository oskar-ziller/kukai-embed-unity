import { KukaiEmbed, TypeOfLogin } from 'kukai-embed';
import { useEffect, useRef, useState } from 'react';
import './App.css';

enum ACTION_TYPES {
  OPERATION = 'operation',
  LOGIN = 'login',
}

const REDIRECT_DEEPLINK = 'unitydl://'

const LOGIN_LAYOUT = {
  loginOptions: [TypeOfLogin.Google, TypeOfLogin.Facebook, TypeOfLogin.Twitter],
  wideButtons: [true, true, true]
}

function getAction() {
  const params = new URLSearchParams(decodeURIComponent(window.location.search))
  const hasOperation = params.has(ACTION_TYPES.OPERATION)

  if (hasOperation) {
    const operationPayload = params.get(ACTION_TYPES.OPERATION)!
    return { action: ACTION_TYPES.OPERATION, payload: JSON.parse(operationPayload) }
  }

  return { action: ACTION_TYPES.LOGIN }
}

async function handleLogin(kukaiEmbed: KukaiEmbed) {
  if (kukaiEmbed.user) {
    await kukaiEmbed.logout()
  }

  const { pkh, userData } = await kukaiEmbed.login(LOGIN_LAYOUT) // where pkh: tezos address 
  const { name, email, typeOfLogin } = userData as any

  window.location.href = `${REDIRECT_DEEPLINK}kukai-embed/?address=${pkh}&name=${name}&email=${email}&typeOfLogin=${typeOfLogin}`
}

async function handleOperation(kukaiEmbed: KukaiEmbed, payload: any) {
  let pkh: string, userData: any

  if (!kukaiEmbed.user) {
    const user = await kukaiEmbed.login(LOGIN_LAYOUT)
    pkh = user.pkh
    userData = user.userData

  } else {
    pkh = kukaiEmbed.user.pkh
    userData = kukaiEmbed.user.userData
  }

  const operationHash = await kukaiEmbed.send(payload)
  const { name, email, typeOfLogin } = userData

  window.location.href = `${REDIRECT_DEEPLINK}kukai-embed/?address=${pkh}&name=${name}&email=${email}&typeOfLogin=${typeOfLogin}&operationHash=${operationHash}`
}

function App() {
  const [error, setError] = useState('')
  const kukaiEmbed = useRef(new KukaiEmbed({ net: "https://ghostnet.kukai.app", icon: false }))

  async function handleAction() {
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
