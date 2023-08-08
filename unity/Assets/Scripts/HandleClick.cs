using UnityEngine;
using System.Diagnostics;

public class DeepLinkHandler : MonoBehaviour
{
    public string deepLinkURL = "https://www.example.com";

    public void OpenSafariWithDeepLink()
    {
        Process.Start(deepLinkURL);
    }
}
