import { useState } from "react";
import { ReactComponent as TimescaleLogo } from "../assets/logo.svg";
import "./App.css";
import data from "../assets/recipientsData.json";
import { Autocomplete, Button, TextField } from "@mui/material";
import { ChevronDown, ChevronRight, PlusIcon, Trash } from "lucide-react";

const App = () => {
  interface Recipient {
    email: string;
    isSelected: boolean;
  }

  const [recipients, setRecipients] = useState<Recipient[]>(data);
  const [inputValue, setInputValue] = useState("");
  const [expandedAvailableDomains, setExpandedAvailableDomains] = useState<
    Set<string>
  >(new Set());
  const [expandedSelectedDomains, setExpandedSelectedDomains] = useState<
    Set<string>
  >(new Set());

  const addNewEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      const emailExists = recipients.some(
        (recipient) => recipient.email === email
      );
      if (!emailExists) {
        setRecipients((prev) => [...prev, { email, isSelected: false }]);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue) {
      addNewEmail(inputValue);
      setInputValue("");
    }
  };

  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

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

  const handleDomainDeselect = (domain: string) => {
    setRecipients((prev) =>
      prev.map((recipient) =>
        recipient.email.endsWith(`@${domain}`)
          ? { ...recipient, isSelected: false }
          : recipient
      )
    );
  };

  const handleDomainReselect = (domain: string) => {
    setRecipients((prev) =>
      prev.map((recipient) =>
        recipient.email.endsWith(`@${domain}`)
          ? { ...recipient, isSelected: true }
          : recipient
      )
    );
  };

  const groupedEmails = recipients.reduce(
    (acc: Record<string, Recipient[]>, recipient) => {
      const domain = recipient.email.split("@")[1];
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(recipient);
      return acc;
    },
    {}
  );

  // Toggle the expansion of a domain's email list in Available Recipients
  const handleAvailableDomainToggle = (domain: string) => {
    setExpandedAvailableDomains((prev) => {
      const newExpandedDomains = new Set(prev);
      if (newExpandedDomains.has(domain)) {
        newExpandedDomains.delete(domain);
      } else {
        newExpandedDomains.add(domain);
      }
      return newExpandedDomains;
    });
  };

  // Toggle the expansion of a domain's email list in Selected Recipients
  const handleSelectedDomainToggle = (domain: string) => {
    setExpandedSelectedDomains((prev) => {
      const newExpandedDomains = new Set(prev);
      if (newExpandedDomains.has(domain)) {
        newExpandedDomains.delete(domain);
      } else {
        newExpandedDomains.add(domain);
      }
      return newExpandedDomains;
    });
  };
  return (
    <div>
      <TimescaleLogo />
      <div className="email-display">
        <div className="recipient-box">
          <h4>Available Recipients</h4>
          <Autocomplete
            options={recipients.filter((recipient) => !recipient.isSelected)}
            getOptionLabel={(option) => option.email || ""}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onChange={handleSelectionChange}
            renderInput={(params) => <TextField {...params} label="Search" />}
          />
          <div className="recipient-inner-box">
            {Object.keys(groupedEmails).map((domain) => (
              <div key={domain}>
                <h5>
                  <Button onClick={() => handleAvailableDomainToggle(domain)}>
                    {expandedAvailableDomains.has(domain) ? (
                      <ChevronRight />
                    ) : (
                      <ChevronDown />
                    )}
                  </Button>
                  {domain.toUpperCase()}
                  <Button onClick={() => handleDomainReselect(domain)}>
                    <PlusIcon />
                  </Button>
                </h5>
                {!expandedAvailableDomains.has(domain) && (
                  <ul>
                    {groupedEmails[domain].map((recipient) =>
                      !recipient.isSelected ? (
                        <div key={recipient.email}>{recipient.email}</div>
                      ) : (
                        ""
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="recipient-box">
          <h4>Selected Recipients</h4>
          <Autocomplete
            options={recipients.filter((recipient) => recipient.isSelected)}
            getOptionLabel={(option) => option.email || ""}
            onChange={handleSelectionChange}
            renderInput={(params) => <TextField {...params} label="Remove" />}
          />
          <div className="recipient-inner-box">
            {Object.keys(groupedEmails).map((domain) => (
              <div key={domain}>
                <h5>
                  <Button onClick={() => handleSelectedDomainToggle(domain)}>
                    {expandedSelectedDomains.has(domain) ? (
                      <ChevronRight />
                    ) : (
                      <ChevronDown />
                    )}
                  </Button>
                  {domain.toUpperCase()}
                  <Button
                    size="small"
                    onClick={() => handleDomainDeselect(domain)}
                  >
                    <Trash />
                  </Button>
                </h5>
                {!expandedSelectedDomains.has(domain) && (
                  <ul>
                    {groupedEmails[domain].map((recipient) =>
                      recipient.isSelected ? (
                        <div key={recipient.email}>{recipient.email}</div>
                      ) : (
                        ""
                      )
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
