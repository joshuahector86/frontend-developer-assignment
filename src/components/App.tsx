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
  const [expandedDomains, setExpandedDomains] = useState<{
    available: Set<string>;
    selected: Set<string>;
  }>({ available: new Set(), selected: new Set() });

  const toggleDomainExpansion = (
    domain: string,
    type: "available" | "selected"
  ) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [type]: prev[type].has(domain)
        ? new Set([...prev[type]].filter((d) => d !== domain))
        : new Set([...prev[type], domain]),
    }));
  };

  const addNewEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      emailRegex.test(email) &&
      !recipients.some((recipient) => recipient.email === email)
    ) {
      setRecipients((prev) => [...prev, { email, isSelected: false }]);
    }
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

  const handleDomainChange = (
    domain: string,
    action: "select" | "deselect"
  ) => {
    setRecipients((prev) =>
      prev.map((recipient) =>
        recipient.email.endsWith(`@${domain}`)
          ? { ...recipient, isSelected: action === "select" }
          : recipient
      )
    );
  };

  const groupedEmails = recipients.reduce(
    (acc: Record<string, Recipient[]>, recipient) => {
      const domain = recipient.email.split("@")[1];
      acc[domain] = acc[domain] || [];
      acc[domain].push(recipient);
      return acc;
    },
    {}
  );

  return (
    <div>
      <TimescaleLogo />
      <div className="email-display">
        {/* Available Recipients */}
        <div className="recipient-box">
          <h4>Available Recipients</h4>
          <Autocomplete
            options={recipients.filter((recipient) => !recipient.isSelected)}
            getOptionLabel={(option) => option.email || ""}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            onKeyDown={(event) =>
              event.key === "Enter" &&
              inputValue &&
              (addNewEmail(inputValue), setInputValue(""))
            }
            onChange={handleSelectionChange}
            renderInput={(params) => <TextField {...params} label="Search" />}
          />
          <div className="recipient-inner-box">
            {Object.keys(groupedEmails).map((domain) => (
              <div key={domain}>
                <h5>
                  <Button
                    onClick={() => toggleDomainExpansion(domain, "available")}
                  >
                    {expandedDomains.available.has(domain) ? (
                      <ChevronRight />
                    ) : (
                      <ChevronDown />
                    )}
                  </Button>
                  {domain.toUpperCase()}
                  <Button
                    size="small"
                    onClick={() => handleDomainChange(domain, "select")}
                  >
                    Add
                  </Button>
                </h5>
                {!expandedDomains.available.has(domain) && (
                  <ul>
                    {groupedEmails[domain].map((recipient) =>
                      !recipient.isSelected ? (
                        <div key={recipient.email}>{recipient.email}</div>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Recipients */}
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
                  <Button
                    onClick={() => toggleDomainExpansion(domain, "selected")}
                  >
                    {expandedDomains.selected.has(domain) ? (
                      <ChevronRight />
                    ) : (
                      <ChevronDown />
                    )}
                  </Button>
                  {domain.toUpperCase()}
                  <Button
                    onClick={() => handleDomainChange(domain, "deselect")}
                  >
                    <Trash />
                  </Button>
                </h5>
                {!expandedDomains.selected.has(domain) && (
                  <ul>
                    {groupedEmails[domain].map((recipient) =>
                      recipient.isSelected ? (
                        <div key={recipient.email}>{recipient.email}</div>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p>Dimitri Hector - Novemeber 2024</p>
    </div>
  );
};

export default App;
