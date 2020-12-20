App = {
  contractArtifact: null,
  web3Provider: null,
  identity: null,

  init: async function () {
    App.editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
      lineNumbers: true,
      mode: { name: 'javascript', json: true },
      theme: 'base16-dark',
    });
    App.editor.setSize(null, 500);
    var cm = $('.CodeMirror')[0].CodeMirror;
    $(cm.getWrapperElement()).hide();

    App.contractArtifact = await $.getJSON(
      'IntelligibleIdentitySmartContract.json'
    );
    console.log('Got Contract Artifact');

    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance ?
    try {
      App.web3Provider = ethereum;
      ethereum.enable();
    } catch (error) {
      document.getElementById('metamask').style.display = 'block';
      document.getElementById('formdiv').style.display = 'none';
      $('#cstatus').text('You need an Ethereum provider (Metamask)');
    }
    console.log('Web3 Ok');

    try {
      App.identity = new IntelligibleIdentity();
      App.identity.initWeb3(App.web3Provider, App.contractArtifact);
      const contractAddress = App.contractArtifact.networks['3'].address; //TODO
      $('#cstatus').text('Contract found at:');
      $('#clink').text('https://ropsten.etherscan.io/token/' + contractAddress);
      $('#clink').attr(
        'href',
        'https://ropsten.etherscan.io/token/' + contractAddress
      );
    } catch (error) {
      console.log(error);
    }
    console.log('Contract found, ready to work');

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.form-submit', App.handleUpload);
  },

  handleUpload: async function (event) {
    event.preventDefault();
    console.log('Registration...');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const personalInformation = { name, email };

    document.getElementById('registration').style.display = 'none';
    document.getElementById('editorTitle').style.display = 'block';
    const cm = $('.CodeMirror')[0].CodeMirror;
    $(cm.getWrapperElement()).show();
    App.editor.setValue(
      'Confirm the transaction in the wallet app if you want to continue ->'
    );

    //Token
    const res = await App.identity.newIdentityTokenWeb3(personalInformation);
    console.log('Token Ok');

    //AKN Document
    const aknDocumentPartiallySigned = App.identity.newAKNDocument(
      res.identityAknURI,
      personalInformation,
      res.publicKey,
      res.tokenId
    );
    $('#editorTitle').text('Partially signed Akoma Ntoso Document');
    App.editor.setValue(aknDocumentPartiallySigned);
    console.log('Partially signed Ok');

    //Sign
    const aknDocumentComplete = await App.identity.signDataWeb3(
      aknDocumentPartiallySigned
    );
    $('#editorTitle').text('Complete Akoma Ntoso Document');
    App.editor.setValue(aknDocumentComplete);
    console.log('Registration Complete');
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

$('form').keypress(function (e) {
  //Enter key
  if (e.which == 13) {
    return false;
  }
});
