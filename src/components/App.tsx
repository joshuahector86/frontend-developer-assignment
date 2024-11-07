import { useMemo, useState } from "react";
import { ReactComponent as TimescaleLogo } from "../assets/logo.svg";
import "./App.css";
import data from "../assets/recipientsData.json";
import { Autocomplete, Button, TextField } from "@mui/material";
import { PlusIcon, Trash } from "lucide-react";

const App = () => {
  interface Recipient {
    email: string;
    isSelected: boolean;
  }

  const [recipients, setRecipients] = useState<Recipient[]>(data);
  const [inputValue, setInputValue] = useState("");

  // Toggle isSelected status
  const handleSelectionChange = (_event: any, value: Recipient | null) => {
    if (value) {
      const updatedRecipients = recipients.map((recipient) =>
        recipient.email === value.email
          ? { ...recipient, isSelected: !recipient.isSelected }
          : recipient
      );
      setRecipients(updatedRecipients);
    }
  };

  // Add new email if it does not exist in recipients
  const addNewEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      // Check if email already exists
      const emailExists = recipients.some(
        (recipient) => recipient.email === email
      );
      if (!emailExists) {
        setRecipients((prev) => [...prev, { email, isSelected: false }]);
      }
    }
  };
  // Handle Enter key and onBlur event to add email and domain
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue) {
      addNewEmail(inputValue); // Only add when Enter is pressed
      setInputValue(""); // Clear input after adding
    }
  };

  // Handle blur event to add email and domain
  const handleBlur = () => {
    if (inputValue) {
      addNewEmail(inputValue); // Only add when input is finalized
      setInputValue(""); // Clear input after adding
    }
  };

  // Handle input change
  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  // Group emails by domain
  const groupedEmails = useMemo(() => {
    return recipients.reduce((acc: Record<string, Recipient[]>, recipient) => {
      const domain = recipient.email.split("@")[1];
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(recipient);
      return acc;
    }, {});
  }, [recipients]);

  // Deselect all recipients under a specific domain
  const handleDomainDeselect = (domain: string) => {
    const updatedRecipients = recipients.map((recipient) =>
      recipient.email.endsWith(`@${domain}`)
        ? { ...recipient, isSelected: false }
        : recipient
    );
    setRecipients(updatedRecipients);
  };

  // Reselect all recipients under a specific domain
  const handleDomainReselect = (domain: string) => {
    const updatedRecipients = recipients.map((recipient) =>
      recipient.email.endsWith(`@${domain}`)
        ? { ...recipient, isSelected: true }
        : recipient
    );
    setRecipients(updatedRecipients);
  };

  return (
    <div>
      <TimescaleLogo />
      <div className="email-display">
        {/* ---------------------------- AVAILABLE RECIPIENTS ---------------------------- */}
        <div className="recipient-box">
          <h4>Available Recipients</h4>
          <Autocomplete
            options={recipients
              .filter((recipient) => !recipient.isSelected)
              .map((recipient) => recipient)}
            getOptionLabel={(option) => option.email || ""}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onChange={handleSelectionChange}
            renderInput={(params) => <TextField {...params} label="Search" />}
          />
          <div className="recipient-inner-box">
            {Object.keys(groupedEmails).map((domain) => (
              <div key={domain}>
                <h5>
                  {domain.toUpperCase()}
                  <Button onClick={() => handleDomainReselect(domain)}>
                    <PlusIcon />
                  </Button>
                </h5>
                <ul>
                  {groupedEmails[domain].map((recipient) =>
                    !recipient.isSelected ? (
                      <div key={recipient.email}>{recipient.email}</div>
                    ) : (
                      ""
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------- SELECTED RECIPIENTS ---------------------------- */}
        <div className="recipient-box">
          <h4>Selected Recipients</h4>
          <Autocomplete
            options={recipients
              .filter((recipient) => recipient.isSelected)
              .map((recipient) => recipient)}
            getOptionLabel={(option) => option.email || ""}
            onChange={handleSelectionChange}
            renderInput={(params) => <TextField {...params} label="Remove" />}
          />
          <div className="recipient-inner-box">
            {Object.keys(groupedEmails).map((domain) => (
              <div key={domain}>
                <h5>
                  {domain.toUpperCase()}
                  <Button
                    size="small"
                    onClick={() => handleDomainDeselect(domain)}
                  >
                    <Trash />
                  </Button>
                </h5>
                <ul>
                  {groupedEmails[domain].map((recipient) =>
                    recipient.isSelected ? (
                      <div key={recipient.email}>{recipient.email}</div>
                    ) : (
                      ""
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
