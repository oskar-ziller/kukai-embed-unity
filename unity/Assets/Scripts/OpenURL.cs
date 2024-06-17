using UnityEngine;
using UnityEngine.UI;
using System.Diagnostics;

public class Singleton : MonoBehaviour
{
    private static Singleton _instance;

    public static Singleton Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = new GameObject("Singleton").AddComponent<Singleton>();
                DontDestroyOnLoad(_instance.gameObject);
            }
            return _instance;
        }
    }

    private string address;
    private string typeOfLogin;

    public string Address
    {
        get { return address; }
        set { address = value; }
    }

    public string TypeOfLogin
    {
        get { return typeOfLogin; }
        set { typeOfLogin = value; }
    }

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}


public class OpenURL : MonoBehaviour
{
    public string deepLinkURL = "http://localhost:3000";

    public void OpenLoginLink()
    {
        Application.OpenURL($"{deepLinkURL}/?action=login");
    }

    public void OpenOperationLink()
    {
        string encodedJsonPayload = "[{\"kind\":\"transaction\",\"source\":\"" + Singleton.Instance.Address + "\",\"gas_limit\":\"7942\",\"storage_limit\":\"350\",\"amount\":\"1500000\",\"destination\":\"KT1MFWsAXGUZ4gFkQnjByWjrrVtuQi4Tya8G\",\"parameters\":{\"entrypoint\":\"fulfill_ask\",\"value\":{\"prim\":\"Pair\",\"args\":[{\"int\":\"11000856\"},{\"prim\":\"Pair\",\"args\":[{\"int\":\"1\"},{\"prim\":\"Pair\",\"args\":[{\"prim\":\"None\"},{\"prim\":\"Pair\",\"args\":[{\"prim\":\"None\"},[]]}]}]}]}}}]";

        Application.OpenURL($"{deepLinkURL}/?action=operation&typeOfLogin={Singleton.Instance.TypeOfLogin}&operation={encodedJsonPayload}");
    }
}
