// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracking {
    enum Status { PENDENTE, EM_TRANSITO, ENTREGUE }

    struct Envio {
        address remetente;
        address destinatario;
        uint256 horaColeta;
        uint256 horaEntrega;
        uint256 distancia;
        uint256 custo;
        string nomePeca;
        Status status;
        bool estaPago;
    }

    mapping(address => Envio[]) public envios;
    uint256 public contagemEnvio;

    struct TipoEnvio {
        address remetente;
        address destinatario;
        uint256 horaColeta;
        uint256 horaEntrega;
        uint256 distancia;
        uint256 custo;
        string nomePeca;
        Status status;
        bool estaPago;
    }

    TipoEnvio[] tipoEnvios; // array

    event EnvioCriado(address indexed remetente, address indexed destinatario, uint256 horaColeta, uint256 distancia, uint256 custo, string nomePeca);
    event EnvioEmTransito(address indexed remetente, address indexed destinatario, uint256 horaColeta);
    event EnvioEntregue(address indexed remetente, address indexed destinatario, uint256 indexed horaEntrega);
    event EnvioPago(address indexed remetente, address indexed destinatario, uint256 quantidade);

    constructor() {
        contagemEnvio = 0;
    }

    function criarEnvio(address _destinatario, uint256 _horaColeta, uint256 _distancia, uint256 _custo, string memory _nomePeca) public payable {
        require(msg.value == _custo, "O valor do pagamento deve corresponder ao custo");

        Envio memory envio = Envio(msg.sender, _destinatario, _horaColeta, 0, _distancia, _custo, _nomePeca, Status.PENDENTE, false);

        envios[msg.sender].push(envio);
        contagemEnvio++;

        tipoEnvios.push(
            TipoEnvio(
                msg.sender,
                _destinatario,
                _horaColeta,
                0,
                _distancia,
                _custo,
                _nomePeca,
                Status.PENDENTE,
                false
            )
        );
        emit EnvioCriado(msg.sender, _destinatario, _horaColeta, _distancia, _custo, _nomePeca);
    }

    function iniciarEnvio(address _remetente, address _destinatario, uint256 _index) public {
        Envio storage envio = envios[_remetente][_index];
        TipoEnvio storage tipoEnvio = tipoEnvios[_index];

        require(envio.destinatario == _destinatario, unicode"Destinatário inválido."); // O prefixo unicode informa ao compilador que a string contém caracteres Unicode e que eles devem ser interpretados corretamente.
        require(envio.status == Status.PENDENTE, unicode"Já está em trânsito");

        envio.status = Status.EM_TRANSITO;
        tipoEnvio.status = Status.EM_TRANSITO;

        emit EnvioEmTransito(_remetente, _destinatario, envio.horaColeta);
    }

    function finalizarEnvio(address _remetente, address _destinatario, uint256 _index) public {
        Envio storage envio = envios[_remetente][_index];
        TipoEnvio storage tipoEnvio = tipoEnvios[_index];

        require(envio.destinatario == _destinatario, unicode"Destinatário inválido.");
        require(envio.status == Status.EM_TRANSITO, unicode"Ainda não está em transito.");
        require(!envio.estaPago, unicode"Já esta pago!"); 

        envio.status = Status.ENTREGUE;
        tipoEnvio.status = Status.ENTREGUE;
        tipoEnvio.horaEntrega = block.timestamp; // block.time stamp representa o momento exato em que esta transação é executada na blockchain
        envio.horaEntrega = block.timestamp;

        uint256 quantidade = envio.custo;

        payable(envio.remetente).transfer(quantidade);

        envio.estaPago = true;
        tipoEnvio.estaPago = true; 

        emit EnvioEntregue(_remetente, _destinatario, envio.horaEntrega);
        emit  EnvioPago(_remetente, _destinatario, quantidade);
    }

    function consultarEnvio(address _remetente, uint256 _index) public view returns (address, address, uint256, uint256, uint256, uint256, string memory, Status, bool) {
        Envio memory envio = envios[_remetente][_index];
        return (envio.remetente, envio.destinatario, envio.horaColeta, envio.horaEntrega, envio.distancia, envio.custo, envio.nomePeca, envio.status, envio.estaPago);
    }

    function consultarQuantidadeEnvio(address _remetente) public view returns (uint256) {
        return envios[_remetente].length;
    }

    function consultarTodosProcessos() public view returns (TipoEnvio[] memory) {
        return tipoEnvios;
    }
}