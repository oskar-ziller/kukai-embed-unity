using UnityEngine;
using UnityEngine.UI;
using System.Diagnostics;

public class OpenURL : MonoBehaviour
{
    public string deepLinkURL = "http://localhost:3000";

    public void OpenLoginLink()
    {
        Application.OpenURL($"{deepLinkURL}/?action=login");
    }

    public void OpenOperationLink()
    {
        string encodedJsonPayload = "[{\"kind\":\"transaction\",\"amount\":\"12345\",\"destination\":\"tz1arY7HNDq17nrZJ7f3sikxuHZgeopsU9xq\"}]";

        Application.OpenURL($"{deepLinkURL}/?action=operation&operation={encodedJsonPayload}");


    }
}
