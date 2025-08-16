import React from 'react';
import { FiX } from 'react-icons/fi';
import './InfoModal.css';

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>About Product Manager Accelerator</h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="modal-body">
          <p>The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped hundreds of students fulfill their career aspirations.</p>
          
          <h3>Our Programs:</h3>
          <ul>
            <li><strong>🚀 PMA Pro:</strong> End-to-end product manager job hunting program</li>
            <li><strong>🚀 AI PM Bootcamp:</strong> Hands-on AI Product Management skills</li>
            <li><strong>🚀 PMA Power Skills:</strong> For existing PMs to sharpen skills</li>
            <li><strong>🚀 PMA Leader:</strong> Career acceleration to Director level</li>
            <li><strong>🚀 1:1 Resume Review:</strong> With interview guarantee</li>
          </ul>

          <div className="contact-info">
            <p><strong>Website:</strong> <a href="https://www.pmaccelerator.io/" target="_blank" rel="noopener noreferrer">pmaccelerator.io</a></p>
            <p><strong>Phone:</strong> +1 (954) 889-1063</p>
            <p><strong>Location:</strong> Boston, MA</p>
          </div>

          <div className="social-links">
            <a href="https://www.youtube.com/c/drnancyli" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.instagram.com/drnancyli/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/school/pmaccelerator/about/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;