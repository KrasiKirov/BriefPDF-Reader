import React, { useState } from 'react';
import './style/style.css';
import axios from 'axios';

function PDFSummary() {
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [maxWords, setMaxWords] = useState(100);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!maxWords) {
            setError('Please enter a number of words for the summary.');
            setResult('');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('pdf', selectedFile);
            formData.append('maxWords', maxWords);

            const response = await axios.post('/api/pdfsummary', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.error) {
                setError(response.data.error);
                return;
            }

            setError('');
            setResult(response.data.summarisedText);

        } catch (error) {
            console.error(error);
            setResult('');
            setError('An error occurred while submitting the form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className='hero d-flex align-items-center justify-content-center text-center flex-column p-5'>
                <h1 className='display-4 mb-4'>BriefPDF Reader</h1>
                <p className='lead mb-4'>Transform lengthy PDFs into concise summaries in seconds</p>
                <form className='w-100' onSubmit={handleSubmit}>
                    <div className="form-group file-upload-wrapper">
                        <input 
                            type='file' 
                            id='fileInput'
                            className='custom-file-input' 
                            accept='.pdf' 
                            onChange={handleFileChange}
                        />
                        <label className="custom-file-label" htmlFor="fileInput">
                            {selectedFile ? selectedFile.name : 'Choose a PDF file'}
                        </label>
                    </div>
                    <div className="form-group row">
                        <div className='col-sm-4 offset-sm-4'>
                            <input
                                type='number'
                                min='10'
                                value={maxWords}
                                onChange={(e) => setMaxWords(e.target.value)}
                                className='form-control custom-input'
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <button
                            type='submit'
                            disabled={!selectedFile || loading}
                            className='btn btn-primary custom-button mt-3 w-100'
                        >
                            {loading ? 'Analysing PDF...' : `Summarize PDF in about ${maxWords} words`}
                        </button>
                    </div>
                </form>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {result && <div className="alert alert-success mt-3">{result}</div>}
        </div>
    );
}

export default PDFSummary;
