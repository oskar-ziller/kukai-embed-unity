using UnityEngine;
using System.Collections;

public class URLSchemeHandler : MonoBehaviour
{
    void Awake()
    {
        // Check if the app was launched from a URL scheme
        string url = Application.absoluteURL;
        if (url.StartsWith("unitydl://"))
        {
            // Handle the URL, perform necessary actions to return to your game
            // For example, load a specific scene or perform specific actions.
        }
    }
}
