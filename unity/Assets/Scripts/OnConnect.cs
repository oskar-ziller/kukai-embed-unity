using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class OnConnect : MonoBehaviour
{
    public Button button;
    // Start is called before the first frame update
    public void OnClick()
    {
     button.gameObject.SetActive(false);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
