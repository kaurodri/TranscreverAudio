import styled from 'styled-components';
import { useState, useEffect } from 'react';
import api from '../api/axiosInstance.js';

const Main = styled.div`
    display: flex;
    align-items: center;

    h1 {
        color: transparent;
        background: linear-gradient(to right, ${({ theme }) => theme.colors.primary.x100}, ${({ theme }) => theme.colors.secondary.x100});
        background-clip: text;
        -webkit-background-clip: text;
    }

`;

const Box = styled.div`
    display: flex;
    width: 45rem;
    margin-top: 0.5rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.background.x500};
    border: 2px solid ${({ theme }) => theme.colors.background.x400};
`;

const Itens = styled.div`
    margin-top: 1.5rem;
    margin-left: 1rem;
    margin-right: 1rem;
    width: 100%;

    button {
        margin-top: 1rem;
        background: linear-gradient(to right, ${({ theme }) => theme.colors.primary.x100}, ${({ theme }) => theme.colors.secondary.x100});
        padding: 10px 20px;
        border-radius: 4px;
        border: none;
        color: ${({ theme }) => theme.colors.text};
        font-weight: bolder;
        text-shadow: 3px 2px 7px ${({ theme }) => theme.colors.primary.x100};
        cursor: pointer;
    }

    button:disabled {
        background-color: ${({ theme }) => theme.colors.background.x200};
        cursor: not-allowed;
    }

`;

const InputArquivo = styled.input`
    margin-left: 1rem;
`;

const Loading = styled.div.withConfig({ shouldForwardProp: (prop) => prop !== 'show' })`
    display: ${props => (props.show ? 'block' : 'none')};
    color: #666;
    margin: 10px 0;
`;

const AreaTexto = styled.div`
    margin-top: 1rem;

    h3 {
        font-weight: 500;
    }
`;

const Linha = styled.div`
    margin-top: 0.2rem;
    margin-bottom: 1rem;
    border-top: 1px solid ${({ theme }) => theme.colors.background.x300};
`;

const TextoTranscrito = styled.textarea`
    width: 100%;
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.colors.background.x100};
    border-radius: 4px;
    margin-bottom: 1rem;
`;

export default function Section() {
    
    const [loading, setLoading] = useState(false);

    async function Transcrever(event) {
        event.preventDefault();

        const audioFile = document.getElementById('audioFile').files[0];
        if (!audioFile) {
            alert('Por favor, selecione um arquivo de áudio.');
            return;
        }

        const submitButton = document.getElementById('submitButton');
        const loadingDiv = document.getElementById('loading');
        const transcribedText = document.getElementById('transcribedText');

        setLoading(true);
        loadingDiv.textContent = 'Enviando arquivo e iniciando transcrição... Este processo pode levar alguns minutos.';
        submitButton.disabled = true;
        transcribedText.value = 'Processando...';

        const formData = new FormData();
        formData.append('audioFile', audioFile);

        try {

            const API_URL = api.defaults.baseURL;
            const response = await fetch(`${API_URL}/transcrito`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            transcribedText.value = result;

        } catch (error) {
            console.error(error);
        } finally {
            loadingDiv.style.display = 'none';
            submitButton.disabled = false;
        
            //Forçar uma atualização visual.
            transcribedText.style.display = 'none';
            transcribedText.offsetHeight; //Forçar reflow.
            transcribedText.style.display = 'block';
        }

    }

    return (
        <Main>
            <div>
                <h1>Transcrever Áudio</h1>
                <Box>
                    <Itens>
                        <form>
                            <label htmlFor="audioFile">Escolha um arquivo de áudio:</label>
                            <InputArquivo type="file" id="audioFile" name="audioFile" accept="audio/*" required></InputArquivo>
                            <br></br>
                            <button type="submit" id="submitButton" onClick={Transcrever}>Transcrever</button>
                        </form>
                        <Loading id="loading" show={loading}></Loading>
                        <AreaTexto>
                            <h3>Texto Transcrito:</h3>
                            <Linha></Linha>
                            <TextoTranscrito id="transcribedText" rows="10" cols="50" readOnly ></TextoTranscrito>
                        </AreaTexto>
                    </Itens>
                </Box>
            </div>
        </Main>
    )
}
