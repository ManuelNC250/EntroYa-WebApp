package com.entroya.dto;

public class NfcFichajeRequest {
    private String cardUid;

    // Constructores
    public NfcFichajeRequest() {}

    public NfcFichajeRequest(String cardUid) {
        this.cardUid = cardUid;
    }

    // Getters y Setters
    public String getCardUid() { return cardUid; }
    public void setCardUid(String cardUid) { this.cardUid = cardUid; }
}