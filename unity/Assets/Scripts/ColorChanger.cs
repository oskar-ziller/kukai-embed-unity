using UnityEngine;
using UnityEngine.UI;
using System.Diagnostics;

public class ButtonColorChanger : MonoBehaviour
{
    public Button colorChangingButton;
    public Color wantedColor;
    public string deepLinkURL = "http://localhost:3000";

    void Start()
    {
    }

    public void ChangeButtonColor()
    {
        // ColorBlock colors = colorChangingButton.colors;
        // colors.normalColor = wantedColor;  // Change this to the desired color
        // colors.highlightedColor = wantedColor;
        // colors.pressedColor = wantedColor;
        // colorChangingButton.colors = colors;

        // Process.Start(deepLinkURL);
        Application.OpenURL(deepLinkURL);
    }
}
