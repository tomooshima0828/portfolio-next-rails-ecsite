# Authentication Flow Architecture

## 1. Component Roles and Separation of Concerns

This diagram illustrates the roles and relationships between the main components involved in the authentication flow.

```mermaid
classDiagram
    direction LR

    class AuthContext {
        <<Context>>
        +user: User | null
        +isAuthenticated: boolean
        +isLoading: boolean
        +error: string | null
        +login(email, password)
        +register(userData)
        +logout()
        +checkAuth()
    }

    class apiClient {
        <<Library>>
        +apiClient(endpoint, options)
        +loginUser(credentials)
        +registerUser(userData)
        +logoutUser()
        +getCurrentUser()
    }

    class UI_Component {
        <<React Component>>
        +onClickLogin()
        +onClickRegister()
    }

    UI_Component --|> AuthContext : uses
    AuthContext --|> apiClient : uses
```

## 2. Login Sequence Flow

This sequence diagram shows the detailed flow when a user attempts to log in.

```mermaid
sequenceDiagram
    participant User
    participant LoginPage as UI Component
    participant AuthContext
    participant apiClient
    participant RailsAPI as Rails API

    User->>LoginPage: Enters email and password, clicks login button
    LoginPage->>AuthContext: Calls login(email, password)
    
    activate AuthContext
    AuthContext->>AuthContext: Sets isLoading = true
    AuthContext->>apiClient: Calls loginUser({ email, password })
    
    activate apiClient
    apiClient->>apiClient: Adds auth token to headers
    apiClient->>RailsAPI: Sends POST /api/v1/login request
    
    activate RailsAPI
    RailsAPI-->>apiClient: Returns login success response (user data + token)
    deactivate RailsAPI
    
    apiClient-->>AuthContext: Returns response
    deactivate apiClient
    
    AuthContext->>AuthContext: Saves token to localStorage
    AuthContext->>AuthContext: Updates user info, sets isAuthenticated = true
    AuthContext->>AuthContext: Sets isLoading = false
    AuthContext-->>LoginPage: Notifies auth state update
    deactivate AuthContext
    
    LoginPage->>User: Redirects to home page or updates UI
```

## Key Points

1. **Separation of Concerns**:
   - UI Components handle user interactions
   - AuthContext manages authentication state and business logic
   - apiClient handles API communication details

2. **Data Flow**:
   - Unidirectional data flow from UI → Context → API Client → Server
   - State updates flow back through the same chain

3. **Error Handling**:
   - Errors are caught and handled at each appropriate level
   - UI receives updates about loading and error states
