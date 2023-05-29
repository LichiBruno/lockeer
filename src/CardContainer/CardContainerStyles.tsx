import styled from "styled-components";
import { Card, majorScale } from "evergreen-ui";

export const StyledCard = styled(Card)`
  box-shadow: ${majorScale(2)}px ${majorScale(2)}px ${majorScale(2)}px rgba(38, 38, 38, 0.6);
`;